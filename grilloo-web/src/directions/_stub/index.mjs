// Test-only direction: exercises routes, head, shared scripts and links at every depth.
import { html } from '../../lib/html.mjs';
import { productBySlug } from '../../lib/data.mjs';
import { scriptTags, styleTags } from '../../lib/seo.mjs';
import { slimProducts } from '../../lib/client-data.mjs';

export const meta = { id: '_stub', name: 'Stub', fonts: ['@fontsource-variable/inter-tight/wght.css'] };

export function renderPage(route, ctx) {
  const nav = ctx.routes.filter((r) => r.kind !== 'product').map((r) => html`<a href="${ctx.link(r.file)}">${r.crumbs.at(-1).label}</a>`);
  const p = route.kind === 'product' ? productBySlug(ctx.data, route.params.slug) : null;
  return html`<!doctype html><html lang="fr"><head>${ctx.head(styleTags(ctx))}</head>
<body><nav>${nav}</nav><h1>${route.title}</h1>
${p ? html`<img src="${ctx.asset(`img/cut/${p.img}.webp`)}" alt="${p.name}"><table>${p.specs.map(([k, v]) => html`<tr><th>${k}</th><td>${v}</td></tr>`)}</table>` : ''}
${route.kind === 'catalogue' ? ctx.jsonScript('catalogue-data', slimProducts(ctx)) : ''}
<a href="${ctx.asset('catalogue-grilloo-2024.pdf')}">PDF</a>
${scriptTags(ctx)}</body></html>`;
}
