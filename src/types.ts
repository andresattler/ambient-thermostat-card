/**
 * The small slice of Home Assistant's frontend types this card relies on.
 * Kept local on purpose so the card has no dependency on HA's frontend packages.
 */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

/** Entity registry entry as exposed on `hass.entities`. */
export interface EntityRegistryEntry {
  entity_id: string;
  device_id?: string | null;
  platform?: string;
  translation_key?: string | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, EntityRegistryEntry>;
  locale?: { language: string };
  language?: string;
  config?: { unit_system?: { temperature?: string } };
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
}

export interface AmbientThermostatCardConfig {
  type: string;
  entity: string;
  name?: string;
}

/** A service call the card wants to make, kept as plain data so it is testable. */
export interface ServiceCall {
  domain: string;
  service: string;
  data: Record<string, unknown>;
}
