import { svg } from "lit";

const icon = (size: number, body: ReturnType<typeof svg>) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const windowIcon = icon(14, svg`<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M12 3v18M5 12h14"/>`);
export const dropIcon = icon(12, svg`<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>`);
export const minusIcon = icon(18, svg`<path d="M6 12h12"/>`);
export const plusIcon = icon(18, svg`<path d="M12 6v12M6 12h12"/>`);
export const flameIcon = icon(
  16,
  svg`<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.3 1.6 1.1 2.6 2.3 3.1C11 9.2 11 6 12 3z"/>`,
);
export const leafIcon = icon(16, svg`<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19l7-7"/>`);
export const powerIcon = icon(16, svg`<path d="M12 3v9"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>`);
