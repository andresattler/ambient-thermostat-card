/**
 * Pure mapping between a climate entity and what the card shows / does.
 *
 * Better Thermostat (https://better-thermostat.org) exposes:
 *  - hvac_mode   `heat` (or `heat_cool` when a cooler is configured) / `off`
 *  - preset_mode `eco`, `none`, … (only the presets enabled by the user)
 *  - hvac_action `heating` / `idle` / `off`
 *  - window_open / door_open   (heating is paused while either is true)
 *  - one `number` entity per preset holding that preset's temperature
 *
 * Any other climate entity works too; BT-only attributes are simply absent.
 */
import type { EntityRegistryEntry, HassEntity, ServiceCall } from "./types";

export type Mode = "heat" | "eco" | "off";
/** Which colour scheme the card uses. */
export type Tone = "heat" | "eco" | "window" | "off";

export type Status =
  | { kind: "unavailable" }
  | { kind: "off" }
  | { kind: "paused"; reason: "window" | "door" }
  | { kind: "active"; action: "heating" | "cooling" | "idle"; preset?: string };

export interface ClimateView {
  available: boolean;
  mode: Mode;
  tone: Tone;
  /** True while the thermostat is actively calling for heat. */
  heating: boolean;
  status: Status;
  current?: number;
  humidity?: number;
  target?: number;
  min: number;
  max: number;
  step: number;
  /** Eco button is only offered when the entity supports the `eco` preset. */
  ecoAvailable: boolean;
}

/** Optimistic values the user just picked but HA has not confirmed yet. */
export interface Pending {
  mode?: Mode;
  target?: number;
}

const ECO = "eco";
const NO_PRESET = "none";

const toNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const isTrue = (value: unknown): boolean =>
  value === true || (typeof value === "string" && value.toLowerCase() === "true");

export const isBetterThermostat = (entity: HassEntity): boolean =>
  entity.attributes.call_for_heat !== undefined;

export function modeOf(entity: HassEntity): Mode {
  if (entity.state === "off") return "off";
  return entity.attributes.preset_mode === ECO ? "eco" : "heat";
}

export function deriveView(entity: HassEntity | undefined, pending: Pending = {}): ClimateView {
  const attrs = entity?.attributes ?? {};
  const available = !!entity && entity.state !== "unavailable" && entity.state !== "unknown";

  const mode = pending.mode ?? (entity ? modeOf(entity) : "off");
  const off = !available || mode === "off";
  const paused = !off && (isTrue(attrs.window_open) || isTrue(attrs.door_open));

  const current = toNumber(attrs.current_temperature);
  const target = pending.target ?? (entity ? targetOf(entity) : undefined);

  // BT reports humidity 0 when no humidity sensor is configured; hide it then.
  let humidity = toNumber(attrs.current_humidity);
  if (humidity === 0 && entity && isBetterThermostat(entity)) humidity = undefined;

  const action = String(attrs.hvac_action ?? "");
  const heating =
    !off &&
    !paused &&
    (action
      ? action === "heating"
      : current !== undefined && target !== undefined && current < target);

  let status: Status;
  if (!available) status = { kind: "unavailable" };
  else if (off) status = { kind: "off" };
  else if (paused) status = { kind: "paused", reason: isTrue(attrs.window_open) ? "window" : "door" };
  else {
    const preset = mode === "eco" ? ECO : pending.mode ? undefined : presetLabel(attrs.preset_mode);
    status = {
      kind: "active",
      action: heating ? "heating" : action === "cooling" ? "cooling" : "idle",
      ...(preset ? { preset } : {}),
    };
  }

  const tone: Tone = off ? "off" : paused ? "window" : mode;

  return {
    available,
    mode,
    tone,
    heating,
    status,
    current,
    humidity,
    target,
    min: toNumber(attrs.min_temp) ?? 7,
    max: toNumber(attrs.max_temp) ?? 35,
    step: toNumber(attrs.target_temp_step) ?? 0.5,
    ecoAvailable: listOf(attrs.preset_modes).includes(ECO),
  };
}

function presetLabel(preset: unknown): string | undefined {
  return typeof preset === "string" && preset !== NO_PRESET ? preset : undefined;
}

/** Snap to the entity's step and clamp to its range. */
export function stepTarget(view: ClimateView, direction: 1 | -1): number | undefined {
  if (view.target === undefined) return undefined;
  const raw = view.target + direction * view.step;
  const snapped = Math.round(raw / view.step) * view.step;
  const clamped = Math.min(view.max, Math.max(view.min, snapped));
  return Number(clamped.toFixed(2));
}

const listOf = (value: unknown): string[] => (Array.isArray(value) ? value : []);

const climateCall = (service: string, data: Record<string, unknown>): ServiceCall => ({
  domain: "climate",
  service,
  data,
});

/** BT with a cooler runs in range mode: no single `temperature`, only low/high setpoints. */
const isRangeMode = (entity: HassEntity): boolean =>
  toNumber(entity.attributes.temperature) === undefined &&
  toNumber(entity.attributes.target_temp_low) !== undefined;

/** Single heating setpoint, also for BT entities running in heat_cool range mode. */
export function targetOf(entity: HassEntity): number | undefined {
  return isRangeMode(entity)
    ? toNumber(entity.attributes.target_temp_low)
    : toNumber(entity.attributes.temperature);
}

/**
 * Changing the target while a preset is active: BT drops the preset unless the new value
 * matches the preset's stored temperature, so we update the preset's own number entity
 * instead (BT's intended path). Otherwise a plain `climate.set_temperature`.
 */
export function setTargetCall(
  entity: HassEntity,
  target: number,
  registry?: Record<string, EntityRegistryEntry>,
): ServiceCall {
  const presetNumber = presetNumberEntity(entity, registry);
  if (presetNumber) return { domain: "number", service: "set_value", data: { entity_id: presetNumber, value: target } };

  const { entity_id, attributes } = entity;
  if (!isRangeMode(entity)) return climateCall("set_temperature", { entity_id, temperature: target });
  // Range mode: the card controls the heating (low) setpoint; HA requires both bounds.
  const high = toNumber(attributes.target_temp_high);
  return climateCall("set_temperature", {
    entity_id,
    target_temp_low: target,
    target_temp_high: high !== undefined ? Math.max(high, target) : target,
  });
}

/** BT's number entity for the active preset's (heating) temperature, if any. */
export function presetNumberEntity(
  entity: HassEntity,
  registry?: Record<string, EntityRegistryEntry>,
): string | undefined {
  const preset = presetLabel(entity.attributes.preset_mode);
  const deviceId = registry?.[entity.entity_id]?.device_id;
  if (!preset || !deviceId) return undefined;
  const key = isRangeMode(entity) ? `preset_${preset}_min` : `preset_${preset}`;
  return Object.values(registry).find(
    (e) =>
      e.device_id === deviceId &&
      e.platform === "better_thermostat" &&
      e.entity_id.startsWith("number.") &&
      e.translation_key === key,
  )?.entity_id;
}

/** Service calls (in order) that switch the entity into `mode`. */
export function setModeCalls(entity: HassEntity, mode: Mode): ServiceCall[] {
  const { entity_id, attributes } = entity;
  if (mode === "off") return [climateCall("set_hvac_mode", { entity_id, hvac_mode: "off" })];

  const calls: ServiceCall[] = [];
  if (entity.state === "off") {
    const hvacModes = listOf(attributes.hvac_modes);
    const onMode = hvacModes.includes("heat") ? "heat" : (hvacModes.find((m) => m !== "off") ?? "heat");
    calls.push(climateCall("set_hvac_mode", { entity_id, hvac_mode: onMode }));
  }

  const wantedPreset = mode === "eco" ? ECO : NO_PRESET;
  const currentPreset = attributes.preset_mode ?? NO_PRESET;
  if (currentPreset !== wantedPreset && listOf(attributes.preset_modes).includes(wantedPreset)) {
    calls.push(climateCall("set_preset_mode", { entity_id, preset_mode: wantedPreset }));
  }
  return calls;
}
