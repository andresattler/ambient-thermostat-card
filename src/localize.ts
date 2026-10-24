import type { Status } from "./model";

const en = {
  room: "Room",
  humidity: "{value} humidity",
  target: "Target",
  heat: "Heat",
  eco: "Eco",
  off: "Off",
  mode: "Mode",
  lower: "Lower target temperature",
  raise: "Raise target temperature",
  "status.unavailable": "Unavailable",
  "status.off": "Off",
  "status.window": "Window open · paused",
  "status.door": "Door open · paused",
  "status.heating": "Heating",
  "status.cooling": "Cooling",
  "status.idle": "Idle",
  "status.preset_heating": "{preset} · heating",
  "status.preset_cooling": "{preset} · cooling",
  "status.preset_idle": "{preset} · idle",
  "preset.eco": "Eco",
  "preset.away": "Away",
  "preset.boost": "Boost",
  "preset.comfort": "Comfort",
  "preset.home": "Home",
  "preset.sleep": "Sleep",
  "preset.activity": "Activity",
};

type MessageKey = keyof typeof en;

const de: Record<MessageKey, string> = {
  room: "Raum",
  humidity: "{value} Luftfeuchte",
  target: "Ziel",
  heat: "Heizen",
  eco: "Eco",
  off: "Aus",
  mode: "Modus",
  lower: "Zieltemperatur senken",
  raise: "Zieltemperatur erhöhen",
  "status.unavailable": "Nicht verfügbar",
  "status.off": "Aus",
  "status.window": "Fenster offen · pausiert",
  "status.door": "Tür offen · pausiert",
  "status.heating": "Heizt",
  "status.cooling": "Kühlt",
  "status.idle": "Bereit",
  "status.preset_heating": "{preset} · heizt",
  "status.preset_cooling": "{preset} · kühlt",
  "status.preset_idle": "{preset} · bereit",
  "preset.eco": "Eco",
  "preset.away": "Abwesend",
  "preset.boost": "Boost",
  "preset.comfort": "Komfort",
  "preset.home": "Zuhause",
  "preset.sleep": "Schlafen",
  "preset.activity": "Aktivität",
};

const languages: Record<string, Record<MessageKey, string>> = { en, de };

export type Localize = (key: MessageKey, vars?: Record<string, string>) => string;

export function localizer(language = "en"): Localize {
  const table = languages[language.split("-")[0]!] ?? en;
  return (key, vars = {}) =>
    (table[key] ?? en[key]).replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? "");
}

export function statusText(status: Status, t: Localize): string {
  switch (status.kind) {
    case "unavailable":
    case "off":
      return t(`status.${status.kind}`);
    case "paused":
      return t(`status.${status.reason}`);
    case "active": {
      if (!status.preset) return t(`status.${status.action}`);
      const presetKey = `preset.${status.preset}` as MessageKey;
      const preset = presetKey in en ? t(presetKey) : capitalize(status.preset);
      return t(`status.preset_${status.action}`, { preset });
    }
  }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
