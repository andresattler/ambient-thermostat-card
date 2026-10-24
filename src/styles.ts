import { css } from "lit";

/**
 * The state colours and backgrounds are public `--ambient-*` CSS variables, so themes can
 * override them (e.g. `ambient-heat-color: "#ff8a65"`). The `--_*` variables are private.
 */
export const styles = css`
  :host {
    --_heat: var(--ambient-heat-color, #f0706a);
    --_eco: var(--ambient-eco-color, #8cc98c);
    --_window: var(--ambient-window-color, #4cb4ee);
    --_off: var(--ambient-off-color, #a8a8a8);

    --_text: var(--ambient-text-color, #e1e1e1);
    --_text-strong: #f2f2f2;
    --_text-muted: #a8a8a8;
    --_text-faint: #9e9e9e;
    --_selected-text: #161616;
    --_unselected-text: #cfcfcf;
    --_text-dim: #6e6e6e;
    --_text-disabled: #8a8a8a;
    --_surface: rgba(255, 255, 255, 0.08);
    --_surface-hover: rgba(255, 255, 255, 0.06);
    --_well: rgba(0, 0, 0, 0.28);

    display: block;
  }

  ha-card {
    --_bg: var(--ambient-off-background, #1c1c1c);
    --_accent: var(--_off);

    box-sizing: border-box;
    height: 100%;
    min-height: 188px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--_bg);
    border-radius: var(--ha-card-border-radius, 16px);
    color: var(--_text);
    font-family: var(--ha-font-family-body, Roboto, system-ui, sans-serif);
    /* Inherited text styles cross the shadow boundary; don't let dashboards leak in. */
    text-transform: none;
    letter-spacing: normal;
    line-height: normal;
    transition: background 0.4s ease;
  }
  ha-card[data-tone="heat"] {
    --_accent: var(--_heat);
    --_bg: var(--ambient-heat-idle-background, #241e1d);
  }
  ha-card[data-tone="heat"][data-heating] {
    --_bg: var(--ambient-heat-background, #2e1d1c);
  }
  ha-card[data-tone="eco"] {
    --_accent: var(--_eco);
    --_bg: var(--ambient-eco-idle-background, #1e221e);
  }
  ha-card[data-tone="eco"][data-heating] {
    --_bg: var(--ambient-eco-background, #1d281d);
  }
  ha-card[data-tone="window"] {
    --_accent: var(--_window);
    --_bg: var(--ambient-window-background, #14232d);
  }

  svg {
    flex: none;
  }

  /* Header: name + status */
  .header {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-left: 4px;
    font-size: 13px;
    font-weight: 500;
  }
  .name {
    all: unset;
    color: var(--_unselected-text);
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .name:focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--_accent);
    white-space: nowrap;
  }
  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--_accent);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pulse {
      animation: none;
    }
  }

  /* Main row: current temperature + target stepper */
  .main {
    height: 68px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    padding-left: 4px;
  }
  .current {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .reading {
    display: flex;
    align-items: flex-start;
  }
  .value {
    font-size: 52px;
    line-height: 52px;
    font-weight: 300;
    letter-spacing: -0.03em;
    color: var(--_text-strong);
  }
  .unit {
    font-size: 18px;
    line-height: 26px;
    color: var(--_text-faint);
    padding-left: 3px;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    line-height: 16px;
    color: var(--_text-muted);
    white-space: nowrap;
  }
  .dot {
    color: var(--_text-dim);
  }

  .target {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: opacity 0.2s ease;
  }
  .target[data-disabled] {
    opacity: 0.4;
  }
  .target-label {
    font-size: 12px;
    line-height: 16px;
    color: var(--_text-muted);
    letter-spacing: 0.04em;
  }
  .stepper {
    height: 44px;
    display: flex;
    align-items: center;
    border-radius: 22px;
    background: var(--_surface);
  }
  .stepper output {
    min-width: 52px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: var(--_text-strong);
    font-variant-numeric: tabular-nums;
  }
  .target[data-disabled] output {
    color: var(--_text-disabled);
  }

  button {
    border: none;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:disabled {
    cursor: default;
  }
  button:focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: -2px;
  }
  .step {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: var(--_text);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .step:not(:disabled):hover {
    background: var(--_surface-hover);
  }

  /* Mode selector */
  .modes {
    height: 44px;
    margin-top: 4px;
    display: flex;
    gap: 4px;
    padding: 3px;
    box-sizing: border-box;
    border-radius: 22px;
    background: var(--_well);
  }
  .mode {
    flex: 1;
    border-radius: 19px;
    color: var(--_unselected-text);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }
  .mode:not([aria-checked="true"]):not(:disabled):hover {
    background: var(--_surface-hover);
  }
  .mode[aria-checked="true"] {
    color: var(--_selected-text);
  }
  .mode[data-mode="heat"][aria-checked="true"] {
    background: var(--_heat);
  }
  .mode[data-mode="eco"][aria-checked="true"] {
    background: var(--_eco);
  }
  .mode[data-mode="off"][aria-checked="true"] {
    background: var(--_text);
  }
`;
