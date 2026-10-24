import { LitElement, html, nothing, type PropertyValues } from "lit";
import { styles } from "./styles";
import { localizer, statusText, type Localize } from "./localize";
import {
  deriveView,
  isBetterThermostat,
  modeOf,
  setModeCalls,
  setTargetCall,
  stepTarget,
  targetOf,
  type ClimateView,
  type Mode,
  type Pending,
} from "./model";
import { dropIcon, flameIcon, leafIcon, minusIcon, plusIcon, powerIcon, windowIcon } from "./icons";
import type { AmbientThermostatCardConfig, HassEntity, HomeAssistant, ServiceCall } from "./types";

declare const __VERSION__: string | undefined;

const CARD_TYPE = "ambient-thermostat-card";
/** Wait this long after the last +/- tap before sending the new target. */
const TARGET_DEBOUNCE_MS = 700;
/** Drop optimistic UI state if HA never confirms it. */
const PENDING_TIMEOUT_MS = 10_000;
const EDITOR_LABELS: Record<string, string> = { entity: "Entity", name: "Name (optional)" };

export class AmbientThermostatCard extends LitElement {
  static override styles = styles;

  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _pending: { state: true },
  };

  // `declare` keeps class fields from shadowing Lit's reactive accessors.
  declare hass?: HomeAssistant;
  private declare _config?: AmbientThermostatCardConfig;
  private declare _pending: Pending;
  private _targetTimer?: ReturnType<typeof setTimeout>;
  private _pendingTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    this._pending = {};
  }

  // ---- Lovelace card API -------------------------------------------------

  setConfig(config: AmbientThermostatCardConfig): void {
    if (!config?.entity || config.entity.split(".")[0] !== "climate") {
      throw new Error("Please set `entity` to a climate entity, e.g. climate.living_room");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  static getStubConfig(hass: HomeAssistant): Partial<AmbientThermostatCardConfig> {
    const climates = Object.values(hass.states).filter((e) => e.entity_id.startsWith("climate."));
    const entity = climates.find(isBetterThermostat) ?? climates[0];
    // A placeholder still renders (as unavailable) instead of failing setConfig.
    return { entity: entity?.entity_id ?? "climate.example" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "climate" } } },
        { name: "name", selector: { text: {} } },
      ],
      computeLabel: (schema: { name: string }) => EDITOR_LABELS[schema.name],
    };
  }

  // ---- Lifecycle ---------------------------------------------------------

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Flush a pending target change instead of silently dropping it.
    if (this._targetTimer) {
      clearTimeout(this._targetTimer);
      this._sendTarget();
    }
    clearTimeout(this._pendingTimer);
    this._pending = {};
  }

  /** `hass` changes on every state change in HA; only re-render for our entity. */
  protected override shouldUpdate(changed: PropertyValues<this>): boolean {
    if (changed.size > 1 || !changed.has("hass")) return true;
    const previous = changed.get("hass") as HomeAssistant | undefined;
    const id = this._config?.entity;
    return (
      !previous ||
      !id ||
      previous.states[id] !== this.hass?.states[id] ||
      previous.locale !== this.hass?.locale ||
      previous.config !== this.hass?.config
    );
  }

  /**
   * Clear optimistic values once HA reports back: the mode once it matches, the target
   * as soon as the entity reports any new target (BT may clamp or round what we sent).
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    const entity = this._entity;
    if (!changed.has("hass") || !entity) return;
    const previous = (changed.get("hass") as HomeAssistant | undefined)?.states[entity.entity_id];
    const { mode, target } = this._pending;
    const next: Pending = { ...this._pending };
    if (mode !== undefined && modeOf(entity) === mode) delete next.mode;
    const reported = targetOf(entity);
    const targetChanged = previous !== undefined && targetOf(previous) !== reported;
    if (target !== undefined && !this._targetTimer && (reported === target || targetChanged)) delete next.target;
    if (next.mode !== mode || next.target !== target) this._pending = next;
  }

  private get _entity(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.entity] : undefined;
  }

  // ---- Rendering ---------------------------------------------------------

  protected override render() {
    if (!this._config || !this.hass) return nothing;
    const entity = this._entity;
    const t = localizer(language(this.hass));
    const view = deriveView(entity, this._pending);
    const name = this._config.name ?? entity?.attributes.friendly_name ?? this._config.entity;

    return html`
      <ha-card data-tone=${view.tone} ?data-heating=${view.heating}>
        <div class="header">
          <button class="name" @click=${this._openMoreInfo}>${name}</button>
          <span class="status" role="status">
            ${view.status.kind === "paused" ? windowIcon : nothing}
            ${view.heating ? html`<span class="pulse"></span>` : nothing}
            <span>${statusText(view.status, t)}</span>
          </span>
        </div>

        <div class="main">
          ${this._renderCurrent(view, t)} ${this._renderTarget(view, t)}
        </div>

        ${this._renderModes(view, t)}
      </ha-card>
    `;
  }

  private _renderCurrent(view: ClimateView, t: Localize) {
    return html`
      <div class="current">
        <div class="reading">
          <span class="value">${this._format(view.current)}</span>
          <span class="unit">${this.hass?.config?.unit_system?.temperature ?? "°C"}</span>
        </div>
        <span class="meta">
          <span>${t("room")}</span>
          ${view.humidity !== undefined
            ? html`<span class="dot">·</span>
                <span class="humidity">
                  ${dropIcon}<span>${t("humidity", { value: `${Math.round(view.humidity)}%` })}</span>
                </span>`
            : nothing}
        </span>
      </div>
    `;
  }

  private _renderTarget(view: ClimateView, t: Localize) {
    const disabled = !view.available || view.mode === "off" || view.target === undefined;
    return html`
      <div class="target" ?data-disabled=${disabled}>
        <span class="target-label">${t("target")}</span>
        <div class="stepper">
          <button
            class="step"
            aria-label=${t("lower")}
            ?disabled=${disabled || view.target! <= view.min}
            @click=${() => this._step(view, -1)}
          >
            ${minusIcon}
          </button>
          <output aria-live="polite">${this._format(view.target)}°</output>
          <button
            class="step"
            aria-label=${t("raise")}
            ?disabled=${disabled || view.target! >= view.max}
            @click=${() => this._step(view, 1)}
          >
            ${plusIcon}
          </button>
        </div>
      </div>
    `;
  }

  private _renderModes(view: ClimateView, t: Localize) {
    const button = (mode: Mode, icon: unknown, label: string) => html`
      <button
        class="mode"
        role="radio"
        data-mode=${mode}
        aria-checked=${view.available && view.mode === mode ? "true" : "false"}
        ?disabled=${!view.available}
        @click=${() => this._setMode(mode)}
      >
        ${icon}<span>${label}</span>
      </button>
    `;
    return html`
      <div class="modes" role="radiogroup" aria-label=${t("mode")}>
        ${button("heat", flameIcon, t("heat"))}
        ${view.ecoAvailable || view.mode === "eco" ? button("eco", leafIcon, t("eco")) : nothing}
        ${button("off", powerIcon, t("off"))}
      </div>
    `;
  }

  private _format(value: number | undefined): string {
    if (value === undefined) return "–";
    return new Intl.NumberFormat(language(this.hass), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  // ---- Actions -----------------------------------------------------------

  private _step(view: ClimateView, direction: 1 | -1): void {
    const target = stepTarget(view, direction);
    if (target === undefined) return;
    this._setPending({ target });
    clearTimeout(this._targetTimer);
    this._targetTimer = setTimeout(() => this._sendTarget(), TARGET_DEBOUNCE_MS);
  }

  private _sendTarget(): void {
    this._targetTimer = undefined;
    const entity = this._entity;
    const { target } = this._pending;
    if (!entity || target === undefined) return;
    void this._callServices([setTargetCall(entity, target, this.hass?.entities)]);
  }

  private _setMode(mode: Mode): void {
    const entity = this._entity;
    if (!entity) return;
    const calls = setModeCalls(entity, mode);
    if (calls.length === 0) return;
    this._setPending({ mode });
    void this._callServices(calls);
  }

  private async _callServices(calls: ServiceCall[]): Promise<void> {
    try {
      // Sequential on purpose: e.g. turn on first, then switch preset.
      for (const { domain, service, data } of calls) {
        await this.hass!.callService(domain, service, data);
      }
    } catch (err) {
      // HA already shows a toast for failed service calls; just drop the optimistic state.
      this._pending = {};
      console.error("[ambient-thermostat-card]", err);
    }
  }

  private _setPending(patch: Pending): void {
    this._pending = { ...this._pending, ...patch };
    clearTimeout(this._pendingTimer);
    this._pendingTimer = setTimeout(() => (this._pending = {}), PENDING_TIMEOUT_MS);
  }

  private _openMoreInfo(): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this._config?.entity },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

function language(hass?: HomeAssistant): string {
  return hass?.locale?.language ?? hass?.language ?? "en";
}

// ---- Registration ----------------------------------------------------------

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, AmbientThermostatCard);
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards ??= [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "Ambient Thermostat Card",
    description: "A calm thermostat card made for Better Thermostat.",
    preview: true,
    documentationURL: "https://github.com/andresattler/ambient-thermostat-card",
  });
}

console.info(`%c AMBIENT-THERMOSTAT-CARD %c ${typeof __VERSION__ === "string" ? __VERSION__ : "dev"} `, "background:#f0706a;color:#161616", "");
