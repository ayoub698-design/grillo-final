// Pure ES module, shipped as-is to the browser (no Node imports).
export const fold = (s) => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });
const prod = (p) => (typeof p.key?.productivity === 'number' ? p.key.productivity : null);

function byProductivity(dir) {
  return (a, b) => {
    const x = prod(a), y = prod(b);
    if (x === null && y === null) return collator.compare(a.name, b.name);
    if (x === null) return 1;
    if (y === null) return -1;
    return dir * (x - y);
  };
}

export function filterProducts(products, { gamme, energy, minProductivity, q, sort } = {}) {
  const query = fold(q).trim();
  const min = Number(minProductivity);
  let out = products.filter((p) =>
    (!gamme || p.gamme === gamme) &&
    (!energy || p.key?.energy === energy) &&
    (!(min > 0) || (prod(p) !== null && prod(p) >= min)) &&
    (!query || fold(`${p.name} ${p.kind} ${p.lead ?? ''}`).includes(query)));
  if (sort === 'nom') out = [...out].sort((a, b) => collator.compare(a.name, b.name));
  else if (sort === 'rendement-asc') out = [...out].sort(byProductivity(1));
  else if (sort === 'rendement-desc') out = [...out].sort(byProductivity(-1));
  return out;
}
