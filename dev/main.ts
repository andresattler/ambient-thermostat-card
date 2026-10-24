/**
 * Dev preview without Home Assistant: renders the card against a mocked `hass`.
 * Run `bun run dev` and open the printed URL.
 */
import "../src/ambient-thermostat-card";
import type { HassEntity, HomeAssistant } from "../src/types";

const language = new URLSearchParams(location.search).get("lang") ?? "en";

function btEntity(entity_id: string, state: string, attributes: Record<string, unknown> = {}): HassEntity {
  return {
    entity_id,
    state,
    attributes: {
      friendly_name: "Demo",
      hvac_modes: ["heat", "off"],
      preset_modes: ["none", "eco", "away", "boost", "comfort"],
      preset_mode: "none",
      hvac_action: "idle",
      current_temperature: 19,
      current_humidity: 46,
      temperature: 24,
      min_temp: 5,
      max_temp: 30,
      target_temp_step: 0.5,
      window_open: false,
      door_open: false,
      call_for_heat: true,
      ...attributes,
    },
  };
}

function mockHass(states: HassEntity[], onService?: HomeAssistant["callService"]): HomeAssistant {
  return {
    states: Object.fromEntries(states.map((s) => [s.entity_id, s])),
    // Better Thermostat's per-preset temperature entity for the simulated device.
    entities: {
      "climate.sim": { entity_id: "climate.sim", device_id: "sim", platform: "better_thermostat" },
      "number.sim_eco": { entity_id: "number.sim_eco", device_id: "sim", platform: "better_thermostat", translation_key: "preset_eco" },
    },
    locale: { language },
    config: { unit_system: { temperature: "°C" } },
    callService: onService ?? (async (...args) => console.log("callService", ...args)),
  };
}

function mountCard(container: HTMLElement, entity: string, hass: HomeAssistant, label?: string) {
  const wrapper = document.createElement("div");
  if (label) wrapper.append(label);
  const card = document.createElement("ambient-thermostat-card") as HTMLElement & {
    setConfig(c: unknown): void;
    hass: HomeAssistant;
  };
  card.setConfig({ type: "custom:ambient-thermostat-card", entity });
  card.hass = hass;
  wrapper.append(card);
  container.append(wrapper);
  return card;
}

// ---- The five states from the design artboard ------------------------------

const designStates: [string, HassEntity][] = [
  ["Heating", btEntity("climate.heating", "heat", { hvac_action: "heating" })],
  ["Idle · target reached", btEntity("climate.idle", "heat", { temperature: 21, current_temperature: 21.4 })],
  ["Eco", btEntity("climate.eco", "heat", { preset_mode: "eco", hvac_action: "heating", temperature: 20.5 })],
  ["Window open", btEntity("climate.window", "heat", { window_open: true, hvac_action: "off" })],
  ["Off", btEntity("climate.off", "off", { hvac_action: "off" })],
];
const statesHass = mockHass(designStates.map(([, e]) => e));
for (const [label, entity] of designStates) {
  mountCard(document.getElementById("states")!, entity.entity_id, statesHass, label);
}

// ---- Interactive card: a tiny Better Thermostat simulation -----------------

let sim = btEntity("climate.sim", "heat", { friendly_name: "Living room" });
let card: ReturnType<typeof mountCard>;

function update(state: string, attributes: Record<string, unknown>) {
  const attrs = { ...sim.attributes, ...attributes };
  const on = state !== "off";
  const paused = attrs.window_open || attrs.door_open;
  attrs.hvac_action = !on || paused ? "off" : attrs.current_temperature < attrs.temperature ? "heating" : "idle";
  sim = { ...sim, state, attributes: attrs };
  card.hass = mockHass([sim], callService);
}

const callService: HomeAssistant["callService"] = async (domain, service, data = {}) => {
  console.log("callService", domain, service, data);
  await new Promise((r) => setTimeout(r, 400)); // pretend network + device latency
  if (service === "set_hvac_mode") update(String(data.hvac_mode), {});
  if (service === "set_preset_mode") update(sim.state, { preset_mode: data.preset_mode });
  // Like BT: a manual target change drops the active preset ...
  if (service === "set_temperature") update(sim.state, { temperature: data.temperature, preset_mode: "none" });
  // ... while editing the preset's own number entity keeps it.
  if (service === "set_value") update(sim.state, { temperature: data.value });
};

card = mountCard(document.getElementById("interactive")!, "climate.sim", mockHass([sim], callService));
update(sim.state, {});

const controls = document.getElementById("controls")!;
function toggle(label: string, attr: string) {
  const input = Object.assign(document.createElement("input"), { type: "checkbox" });
  input.onchange = () => update(sim.state, { [attr]: input.checked });
  const el = document.createElement("label");
  el.append(input, ` ${label}`);
  controls.append(el);
}
function slider(label: string, attr: string, min: number, max: number) {
  const input = Object.assign(document.createElement("input"), {
    type: "range", min, max, step: 0.1, value: String(sim.attributes[attr]),
  });
  input.oninput = () => update(sim.state, { [attr]: Number(input.value) });
  const el = document.createElement("label");
  el.append(`${label} `, input);
  controls.append(el);
}
toggle("Window open", "window_open");
toggle("Door open", "door_open");
slider("Room temp", "current_temperature", 10, 30);
slider("Humidity", "current_humidity", 0, 100);
