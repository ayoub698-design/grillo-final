// Étiquette pictograms: 24×24, 1.25 px stroke, sharp corners (miter), currentColor.
import { raw } from '../../lib/html.mjs';

import { ICON_PATHS as P } from '../../lib/icon-paths.mjs';

export function icon(name, cls = 'e-ico') {
  return raw(`<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="miter" stroke-linecap="square" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`);
}
