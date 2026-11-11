// Direction 1 — « Étiquette » · le cartel de précision.
import { html } from '../../lib/html.mjs';
import { layout } from './layout.mjs';
import { breadcrumbs } from './components.mjs';
import { renderHome } from './pages/home.mjs';
import { renderCatalogue } from './pages/catalogue.mjs';
import { renderProduct } from './pages/product.mjs';
import { renderGamme } from './pages/gamme.mjs';
import { renderRobot } from './pages/robot.mjs';
import { renderSecteurs, renderGuide, renderStone, renderAbout, renderContact } from './pages/secondary.mjs';

export const meta = {
  id: 'etiquette',
  name: 'Étiquette',
  idea: 'Le cartel de précision : les codes du catalogue imprimé traduits en libellés de musée, filets fins et rigueur suisse.',
  fonts: ['@fontsource-variable/host-grotesk/wght.css', '@fontsource/barlow-condensed/500.css', '@fontsource/barlow-condensed/600.css'],
};

const PAGES = { home: renderHome, catalogue: renderCatalogue, product: renderProduct, gamme: renderGamme, robot: renderRobot, secteurs: renderSecteurs, guide: renderGuide, 'guide-pierre': renderStone, about: renderAbout, contact: renderContact };

function pending(ctx, route) {
  return layout(ctx, html`<section class="e-section e-pagehead"><div class="e-wrap">${breadcrumbs(ctx)}<h1 class="e-h1">${route.crumbs.at(-1).label}</h1></div></section>`);
}

export function renderPage(route, ctx) {
  return (PAGES[route.kind] || pending)(ctx, route);
}
