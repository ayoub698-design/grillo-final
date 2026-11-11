// French number formatting: narrow no-break space thousands separator (1 200), comma decimals.
export const fmt = (n, digits = 0) => (typeof n === 'number' && Number.isFinite(n)
  ? n.toLocaleString('fr-FR', { maximumFractionDigits: digits }) : '');
// Narrow no-break space before high punctuation ( : ; ! ? ).
export const fr = (s) => String(s ?? '').replace(/ ([:;!?])/g, '\u202F$1');
export const truncate = (s, n = 155) => { const t = String(s ?? '').trim(); return t.length <= n ? t : `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…`; };
// Fill FAQ templates like "De {productivity.min} à {productivity.max} m²/h".
export function fillTemplate(tpl, ranges) {
  let missing = false;
  const out = tpl.replace(/\{(\w+)\.(min|max)\}/g, (_, k, m) => {
    const r = ranges[k];
    if (!r) { missing = true; return ''; }
    return fmt(r[m], 1);
  });
  return missing ? null : out;
}
export const ENERGY_LABEL = { batterie: 'Batterie', secteur: 'Secteur', manuel: 'Manuelle', thermique: 'Thermique', pneumatique: 'Pneumatique' };
