// Direction 3 — « Rondeur » · l'orbite.
import { layout } from './layout.mjs';
import { pageHead } from './components.mjs';
import { renderHome } from './pages/home.mjs';
import { renderCatalogue, renderProduct, renderGamme, renderRobot } from './pages/main-pages.mjs';
import { renderSecteurs, renderGuide, renderStone, renderAbout, renderContact } from './pages/secondary.mjs';

export const meta = {
  id: 'rondeur',
  name: 'Rondeur',
  idea: 'L’orbite : les « oo » du logo deviennent des disques de brosse — une composition centrée, des hublots, des cercles au trait fin.',
  fonts: ['@fontsource-variable/unbounded/wght.css', '@fontsource-variable/inter-tight/wght.css'],
};

const PAGES = { home: renderHome, catalogue: renderCatalogue, product: renderProduct, gamme: renderGamme, robot: renderRobot, secteurs: renderSecteurs, guide: renderGuide, 'guide-pierre': renderStone, about: renderAbout, contact: renderContact };

function pending(ctx, route) {
  return layout(ctx, pageHead(ctx, { label: route.crumbs.at(-1).label, h1: route.crumbs.at(-1).label }));
}

export function renderPage(route, ctx) {
  return (PAGES[route.kind] || pending)(ctx, route);
}
