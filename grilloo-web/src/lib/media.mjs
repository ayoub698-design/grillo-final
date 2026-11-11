// Responsive art direction: one hero scene in three crops (landscape / square / portrait).
import { html } from './html.mjs';

export const HERO_FORMATS = ['l', 's', 'p'];

export function heroPicture(ctx, direction, alt, cls = '') {
  const src = (k) => ctx.asset(`img/gen/hero-${direction}-${k}.webp`);
  return html`<picture class="${cls}">
    <source media="(max-aspect-ratio: 4/5)" srcset="${src('p')}">
    <source media="(max-aspect-ratio: 5/4)" srcset="${src('s')}">
    <img src="${src('l')}" alt="${alt}" fetchpriority="high" decoding="async">
  </picture>`;
}

// Image sets used instead of a single large picture per section.
export const SECTOR_SET = {
  sante: ['amb-clinique', 'det-ecume', 'det-raclette-eau'],
  logistique: ['amb-entrepot', 'det-entrepot', 'amb-parking'],
  industrie: ['amb-agro', 'det-brosse-terrazzo', 'det-entrepot'],
  commerce: ['amb-mall', 'amb-escalator', 'det-pierre'],
  hotellerie: ['amb-hotel', 'det-hotel', 'det-pierre'],
  collectivites: ['amb-gare', 'amb-parking', 'det-raclette-eau'],
};
export const GAMME_SET = {
  autolaveuses: ['amb-mall', 'det-raclette-eau', 'det-brosse-terrazzo'],
  aspirateurs: ['amb-hotel', 'det-hotel', 'det-ecume'],
  balayeuses: ['amb-parking', 'det-entrepot', 'amb-gare'],
  'traitement-des-sols': ['amb-gare', 'det-pierre', 'det-brosse-terrazzo'],
  'textiles-sechage': ['det-hotel', 'amb-hotel', 'det-ecume'],
  'equipements-specialises': ['amb-escalator', 'amb-mall', 'det-raclette-eau'],
};
export const ROBOT_SET = [['amb-mall', 'det-raclette-eau'], ['amb-clinique', 'det-ecume'], ['amb-gare', 'det-pierre']];
export const STONE_SET = ['det-pierre', 'mat-eau-sol-poli', 'det-brosse-terrazzo'];
export const ABOUT_SET = ['amb-gare', 'det-hotel', 'amb-entrepot'];
