// Tagged template producing escaped HTML. Nested html`` results and raw() are not re-escaped.
export class SafeHtml {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
export const raw = (s) => new SafeHtml(String(s ?? ''));

function render(v) {
  if (v === null || v === undefined || v === false || v === true) return '';
  if (v instanceof SafeHtml) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  return escapeHtml(v);
}
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => { out += render(v) + strings[i + 1]; });
  return new SafeHtml(out);
}
