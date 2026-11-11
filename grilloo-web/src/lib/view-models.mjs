// Direction-agnostic view models: the data each page needs, already formatted. Directions only do markup.
import { productsOf, productBySlug, rangeOf, related } from './data.mjs';
import { fmt, fillTemplate, ENERGY_LABEL } from './format.mjs';

export const SECTOR_IMG = { sante: 'amb-clinique', logistique: 'amb-entrepot', industrie: 'amb-agro', commerce: 'amb-mall', hotellerie: 'amb-hotel', collectivites: 'amb-gare' };
export const GAMME_IMG = { autolaveuses: 'amb-mall', aspirateurs: 'amb-hotel', balayeuses: 'amb-parking', 'traitement-des-sols': 'amb-gare', 'textiles-sechage': 'amb-hotel', 'equipements-specialises': 'amb-escalator' };

const TANK_LABEL = { aspirateurs: 'Cuve', balayeuses: 'Bac à déchets', 'textiles-sechage': 'Réservoir' };
const WIDTH_LABEL = { balayeuses: 'Largeur de balayage' };
const KEY_DEFS = [
  ['productivity', 'Rendement', 'm²/h'],
  ['width', 'Largeur de travail', 'mm'],
  ['tank', 'Réservoir', 'L'],
  ['autonomy', 'Autonomie', 'h'],
  ['power', 'Puissance', 'W'],
  ['weight', 'Poids', 'kg'],
];

export function keyFigures(p, max = 4) {
  return KEY_DEFS
    .filter(([k]) => typeof p.key?.[k] === 'number' && Number.isFinite(p.key[k]))
    .slice(0, max)
    .map(([k, label, unit]) => ({
      key: k,
      label: k === 'tank' ? TANK_LABEL[p.gamme] || label : k === 'width' ? WIDTH_LABEL[p.gamme] || label : label,
      value: fmt(p.key[k], 1),
      unit,
    }));
}

export const leadOf = (p) => p.lead || p.description?.[0] || '';

function variantsTable(p) {
  if (!p.variants || p.variants.length < 2) return null;
  const columns = p.variants.map((v) => v.name);
  const labels = [];
  p.variants.forEach((v) => v.specs.forEach(([k]) => { if (!labels.includes(k)) labels.push(k); }));
  const rows = labels.map((label) => ({ label, values: p.variants.map((v) => (v.specs.find(([k]) => k === label) || [null, '—'])[1]) }));
  return { columns, rows };
}

export function productModel(data, slug) {
  const p = productBySlug(data, slug);
  const gamme = data.gammes.find((g) => g.slug === p.gamme);
  const lead = leadOf(p);
  return {
    p, gamme, lead,
    paragraphs: p.lead ? p.description : p.description.slice(1),
    keyFigures: keyFigures(p),
    allFigures: keyFigures(p, 6),
    energy: ENERGY_LABEL[p.key?.energy] || null,
    specs: p.specs || [],
    features: p.features || [],
    accessories: p.accessories || [],
    options: p.options || [],
    variants: variantsTable(p),
    related: related(data, p),
    sectors: data.sectors.filter((s) => s.products.includes(p.slug)).map(({ slug: s, name }) => ({ slug: s, name })),
    images: [p.img, ...(p.imgAlt || [])],
    file: `produits/${p.slug}.html`,
  };
}

export function gammeModel(data, slug) {
  const g = data.gammes.find((x) => x.slug === slug);
  const items = productsOf(data, slug);
  const ranges = Object.fromEntries(['productivity', 'width', 'tank', 'autonomy', 'power', 'weight'].map((k) => [k, rangeOf(items, k)]).filter(([, v]) => v));
  const faq = g.faq.map((f) => ({ q: f.q, a: fillTemplate(f.a, ranges) })).filter((f) => f.a);
  return {
    g, items, ranges, faq, count: items.length,
    cards: items.map((p) => ({ p, lead: leadOf(p), keyFigures: keyFigures(p, 3), file: `produits/${p.slug}.html` })),
    img: GAMME_IMG[slug],
    file: `gammes/${slug}.html`,
  };
}

export function sectorsModel(data) {
  return data.sectors.map((s) => ({ ...s, img: SECTOR_IMG[s.slug], products: s.products.map((slug) => productBySlug(data, slug)) }));
}

export function robotModel(data) {
  const m = productModel(data, 'roboclean-g-plus');
  const d = m.p.description;
  const sections = [
    { title: d[1], paragraphs: [d[2], d[3]] },
    { title: d[4].replace(/\s*!$/, ''), paragraphs: [d[5], d[6]] },
    { title: d[7].replace(/\s*!$/, ''), paragraphs: [d[8]] },
  ];
  return { ...m, intro: d[0], sections, figures: keyFigures(m.p, 6) };
}

export function homeModel(data) {
  const gammes = data.gammes.map((g) => {
    const gm = gammeModel(data, g.slug);
    const byProd = [...gm.items].sort((a, b) => (b.key?.productivity ?? -1) - (a.key?.productivity ?? -1));
    const pick = [byProd[byProd.length - 1], byProd[Math.floor(byProd.length / 2)], byProd[0]];
    const samples = [...new Set(pick)].concat(gm.items).filter((p, i, a) => a.indexOf(p) === i).slice(0, 3);
    return { g, count: gm.count, ranges: gm.ranges, samples, file: gm.file, img: gm.img };
  });
  return {
    gammes,
    robot: robotModel(data),
    sectors: sectorsModel(data).map((s) => ({ slug: s.slug, name: s.name, intro: s.intro, img: s.img, count: s.products.length })),
    values: data.brand.values,
    steps: data.site.stoneSteps,
    totals: { products: data.products.length, gammes: data.gammes.length },
  };
}
