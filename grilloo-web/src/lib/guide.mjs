// Pure ES module, shipped as-is to the browser (no Node imports).
export const NOTE = 'Estimation indicative basée sur les rendements théoriques du catalogue.';

const MATCH = {
  dur: (p) => p.gamme === 'autolaveuses' || p.gamme === 'traitement-des-sols',
  textile: (p) => p.family === 'injecteurs' || p.slug === 'gsb2' || p.slug === 'gsb660',
  exterieur: (p) => p.gamme === 'balayeuses',
  escalator: (p) => p.family === 'escalators',
};

const positive = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function recommend(products, { surfaceType, area, hours, energy = 'indifferent', cluttered = false, limit = 6 } = {}) {
  const match = MATCH[surfaceType];
  const a = positive(area), h = positive(hours);
  const needed = a !== null && h !== null ? Math.ceil(a / h) : null;
  if (!match) return { needed, items: [], note: NOTE };
  const narrow = (p) => typeof p.key?.width === 'number' && p.key.width <= 600;
  const pr = (p) => (typeof p.key?.productivity === 'number' ? p.key.productivity : null);
  const items = products
    .filter(match)
    .filter((p) => needed === null || (pr(p) !== null && pr(p) >= needed))
    .filter((p) => !energy || energy === 'indifferent' || p.key?.energy === energy)
    .sort((x, y) => {
      if (cluttered && narrow(x) !== narrow(y)) return narrow(x) ? -1 : 1;
      return (pr(x) ?? Infinity) - (pr(y) ?? Infinity);
    })
    .slice(0, limit);
  return { needed, items, note: NOTE };
}
