import { describe, expect, test } from "bun:test";
import { deriveView, setModeCalls, setTargetCall, stepTarget } from "../src/model";
import { localizer, statusText } from "../src/localize";
import type { EntityRegistryEntry, HassEntity } from "../src/types";

/** A Better Thermostat entity as it appears in HA, with overridable bits. */
function bt(state = "heat", attributes: Record<string, unknown> = {}): HassEntity {
  return {
    entity_id: "climate.demo",
    state,
    attributes: {
      friendly_name: "Demo",
      hvac_modes: ["heat", "off"],
      preset_modes: ["none", "eco", "boost"],
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

const t = localizer("en");
const status = (entity: HassEntity) => statusText(deriveView(entity).status, t);

describe("design states", () => {
  test("heating", () => {
    const view = deriveView(bt("heat", { hvac_action: "heating" }));
    expect(view).toMatchObject({ mode: "heat", tone: "heat", heating: true, current: 19, target: 24, humidity: 46 });
    expect(status(bt("heat", { hvac_action: "heating" }))).toBe("Heating");
  });

  test("idle, target reached", () => {
    const entity = bt("heat", { temperature: 21, current_temperature: 21.4 });
    expect(deriveView(entity)).toMatchObject({ tone: "heat", heating: false });
    expect(status(entity)).toBe("Idle");
  });

  test("eco", () => {
    const entity = bt("heat", { preset_mode: "eco", hvac_action: "heating", temperature: 20.5 });
    expect(deriveView(entity)).toMatchObject({ mode: "eco", tone: "eco", heating: true });
    expect(status(entity)).toBe("Eco · heating");
  });

  test("window open pauses heating", () => {
    const entity = bt("heat", { window_open: true, hvac_action: "off" });
    expect(deriveView(entity)).toMatchObject({ mode: "heat", tone: "window", heating: false });
    expect(status(entity)).toBe("Window open · paused");
  });

  test("off", () => {
    const entity = bt("off", { hvac_action: "off", window_open: true });
    expect(deriveView(entity)).toMatchObject({ mode: "off", tone: "off", heating: false });
    expect(status(entity)).toBe("Off");
  });
});

describe("edge cases", () => {
  test("door open is reported like a window", () => {
    expect(status(bt("heat", { door_open: true }))).toBe("Door open · paused");
  });

  test("other presets are shown in the status, Heat stays selected", () => {
    const entity = bt("heat", { preset_mode: "boost", hvac_action: "heating" });
    expect(deriveView(entity).mode).toBe("heat");
    expect(status(entity)).toBe("Boost · heating");
    expect(statusText(deriveView(entity).status, localizer("de"))).toBe("Boost · heizt");
  });

  test("unavailable entity", () => {
    const view = deriveView(bt("unavailable"));
    expect(view).toMatchObject({ available: false, tone: "off" });
    expect(statusText(view.status, t)).toBe("Unavailable");
    expect(deriveView(undefined).available).toBe(false);
  });

  test("BT reports humidity 0 without a sensor: hidden", () => {
    expect(deriveView(bt("heat", { current_humidity: 0 })).humidity).toBeUndefined();
  });

  test("eco button only when the preset is enabled", () => {
    expect(deriveView(bt()).ecoAvailable).toBe(true);
    expect(deriveView(bt("heat", { preset_modes: ["none", "boost"] })).ecoAvailable).toBe(false);
  });

  test("plain climate entity without hvac_action falls back to current < target", () => {
    const entity: HassEntity = {
      entity_id: "climate.generic",
      state: "heat",
      attributes: { current_temperature: 18, temperature: 21 },
    };
    expect(deriveView(entity).heating).toBe(true);
  });

  test("heat_cool range mode uses the low setpoint", () => {
    const entity = bt("heat_cool", { temperature: null, target_temp_low: 21, target_temp_high: 25 });
    expect(deriveView(entity).target).toBe(21);
    expect(setTargetCall(entity, 21.5).data).toEqual({
      entity_id: "climate.demo",
      target_temp_low: 21.5,
      target_temp_high: 25,
    });
  });

  test("range mode without a cool setpoint still sends a valid high bound", () => {
    const entity = bt("heat_cool", { temperature: null, target_temp_low: 21, target_temp_high: null });
    expect(setTargetCall(entity, 21.5).data).toMatchObject({ target_temp_low: 21.5, target_temp_high: 21.5 });
  });

  test("pending values override the entity (optimistic UI)", () => {
    expect(deriveView(bt(), { mode: "off", target: 22 })).toMatchObject({ mode: "off", target: 22 });
  });
});

describe("target stepping", () => {
  test("steps by target_temp_step and clamps", () => {
    expect(stepTarget(deriveView(bt()), 1)).toBe(24.5);
    expect(stepTarget(deriveView(bt("heat", { temperature: 30 })), 1)).toBe(30);
    expect(stepTarget(deriveView(bt("heat", { temperature: 5 })), -1)).toBe(5);
    expect(stepTarget(deriveView(bt("heat", { target_temp_step: 0.1, temperature: 20.3 })), -1)).toBe(20.2);
  });

  test("snaps off-grid values onto the step grid", () => {
    expect(stepTarget(deriveView(bt("heat", { temperature: 21.3 })), 1)).toBe(22);
  });
});

describe("mode service calls", () => {
  const svc = (calls: ReturnType<typeof setModeCalls>) => calls.map((c) => `${c.service}:${Object.values(c.data)[1]}`);

  test("off", () => {
    expect(svc(setModeCalls(bt(), "off"))).toEqual(["set_hvac_mode:off"]);
  });

  test("eco from heat only switches the preset", () => {
    expect(svc(setModeCalls(bt(), "eco"))).toEqual(["set_preset_mode:eco"]);
  });

  test("eco from off turns on first", () => {
    expect(svc(setModeCalls(bt("off"), "eco"))).toEqual(["set_hvac_mode:heat", "set_preset_mode:eco"]);
  });

  test("heat from eco clears the preset", () => {
    expect(svc(setModeCalls(bt("heat", { preset_mode: "eco" }), "heat"))).toEqual(["set_preset_mode:none"]);
  });

  test("heat when already heating does nothing", () => {
    expect(setModeCalls(bt(), "heat")).toEqual([]);
  });

  test("turning on a BT entity with a cooler uses heat_cool", () => {
    expect(svc(setModeCalls(bt("off", { hvac_modes: ["heat_cool", "off"] }), "heat"))).toEqual([
      "set_hvac_mode:heat_cool",
    ]);
  });
});

describe("target service call", () => {
  const registry = (translationKey: string): Record<string, EntityRegistryEntry> => ({
    "climate.demo": { entity_id: "climate.demo", device_id: "dev1", platform: "better_thermostat" },
    "number.demo_eco": {
      entity_id: "number.demo_eco",
      device_id: "dev1",
      platform: "better_thermostat",
      translation_key: translationKey,
    },
    "number.other_eco": {
      entity_id: "number.other_eco",
      device_id: "dev2",
      platform: "better_thermostat",
      translation_key: translationKey,
    },
  });

  test("without a preset: climate.set_temperature", () => {
    expect(setTargetCall(bt(), 22, registry("preset_eco"))).toEqual({
      domain: "climate",
      service: "set_temperature",
      data: { entity_id: "climate.demo", temperature: 22 },
    });
  });

  test("in eco: updates BT's eco temperature so the preset stays active", () => {
    expect(setTargetCall(bt("heat", { preset_mode: "eco" }), 19.5, registry("preset_eco"))).toEqual({
      domain: "number",
      service: "set_value",
      data: { entity_id: "number.demo_eco", value: 19.5 },
    });
  });

  test("in eco with a cooler: uses the preset's _min number", () => {
    const entity = bt("heat_cool", { preset_mode: "eco", temperature: null, target_temp_low: 19, target_temp_high: 25 });
    expect(setTargetCall(entity, 19.5, registry("preset_eco_min")).data.entity_id).toBe("number.demo_eco");
  });

  test("in a preset without a matching number entity: falls back to set_temperature", () => {
    expect(setTargetCall(bt("heat", { preset_mode: "boost" }), 22, registry("preset_eco")).service).toBe("set_temperature");
    expect(setTargetCall(bt("heat", { preset_mode: "eco" }), 22).service).toBe("set_temperature");
  });
});
