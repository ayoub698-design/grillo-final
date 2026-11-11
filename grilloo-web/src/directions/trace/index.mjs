// Direction 2 — « Trace » · le reflet et la buée.
import { html } from '../../lib/html.mjs';
import { layout } from './layout.mjs';
import { pageHead } from './components.mjs';
import { renderHome } from './pages/home.mjs';
import { renderCatalogue, renderProduct, renderGamme, renderRobot } from './pages/main-pages.mjs';
import { renderSecteurs, renderGuide, renderStone, renderAbout, renderContact } from './pages/secondary.mjs';

export const meta = {
  id: 'trace',
  name: 'Trace',
  idea: 'Le reflet et la buée : des sols clairs voilés de poussière que le curseur et le défilement nettoient — le propre comme lumière.',
  fonts: ['@fontsource-variable/hanken-grotesk/wght.css', '@fontsource-variable/jetbrains-mono/wght.css'],
};

const PAGES = { home: renderHome, catalogue: renderCatalogue, product: renderProduct, gamme: renderGamme, robot: renderRobot, secteurs: renderSecteurs, guide: renderGuide, 'guide-pierre': renderStone, about: renderAbout, contact: renderContact };

function pending(ctx, route) {
  return layout(ctx, pageHead(ctx, { label: route.crumbs.at(-1).label, h1: route.crumbs.at(-1).label }));
}

export function renderPage(route, ctx) {
  return (PAGES[route.kind] || pending)(ctx, route);
}
