// Rondeur — shared markup (l'orbite).
import { html, raw } from '../../lib/html.mjs';
import { ICON_PATHS } from '../../lib/icon-paths.mjs';

export function icon(name, cls = 'r-ico') {
  return raw(`<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ''}</svg>`);
}

// Small round index badge + label.
export function kicker(index, label) {
  return html`<p class="r-kicker" data-pop>${index !== null ? html`<span class="r-kicker__dot">${String(index).padStart(2, '0')}</span>` : html`<span class="r-kicker__dot r-kicker__dot--empty"></span>`}${label}</p>`;
}

export function button(href, text, { variant = 'ink', iconName = 'arrow', attrs = '' } = {}) {
  return html`<a class="r-btn r-btn--${variant}" href="${href}" data-magnetic ${raw(attrs)}><span class="r-btn__txt">${text}</span>${iconName ? html`<span class="r-btn__ico">${icon(iconName)}</span>` : ''}</a>`;
}

// Round CTA with text turning around it.
export function orbitCta(href, label = 'Demander un devis') {
  const id = `oc${(orbitCta.n = (orbitCta.n || 0) + 1)}`;
  return html`<a class="r-orbitcta" href="${href}" data-magnetic aria-label="${label}">
    <svg class="r-orbitcta__ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="${id}" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
      <text><textPath href="#${id}" textLength="486" lengthAdjust="spacing">${label.toUpperCase()} · GRILLOO · </textPath></text></svg>
    <span class="r-orbitcta__core">${icon('arrow')}</span>
  </a>`;
}

// Dividers.
export const scallop = (cls = '') => raw(`<div class="r-scallop ${cls}" aria-hidden="true"></div>`);
export const circleChain = () => raw(`<div class="r-chain" aria-hidden="true" data-chain>${'<i></i>'.repeat(9)}</div>`);

export const productImg = (ctx, img, alt, cls = '', eager = false) =>
  html`<img class="${cls}" src="${ctx.asset(`img/cut/${img}.webp`)}" alt="${alt}" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"')}>`;
export const genImg = (ctx, id, alt, cls = '', eager = false) =>
  html`<img class="${cls}" src="${ctx.asset(`img/gen/${id}.webp`)}" alt="${alt}" ${raw(eager ? '' : 'loading="lazy" decoding="async"')}>`;

// Product inside a porthole, key figures orbiting around it.
export function porthole(ctx, img, alt, figures = [], { size = '', eager = false } = {}) {
  return html`<div class="r-hub ${size}">
    <div class="r-hub__disc">${productImg(ctx, img, alt, 'r-hub__img', eager)}</div>
    <svg class="r-hub__orbit" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="49.5"/></svg>
    ${figures.map((f, i) => html`<span class="r-hub__fig" style="--a:${[-38, 38, 142, 218][i] ?? 0}deg"><span><b>${f.value}</b> ${f.unit}</span></span>`)}
  </div>`;
}

export function productCard(ctx, p, figures) {
  const href = ctx.link(`produits/${p.slug}.html`);
  return html`<article class="r-card" data-pop>
    <a href="${href}" class="r-card__media" tabindex="-1" aria-hidden="true"><span class="r-card__disc">${productImg(ctx, p.img, '', 'r-card__img')}</span></a>
    <p class="r-card__kind">${p.kind}</p>
    <h3 class="r-card__name"><a href="${href}">${p.name}</a></h3>
    ${figures.length ? html`<ul class="r-card__figs">${figures.map((f) => html`<li><b>${f.value}</b> ${f.unit}</li>`)}</ul>` : ''}
    <div class="r-card__actions"><a class="r-link" href="${href}">Fiche</a><button class="r-cmp" type="button" data-compare-add="${p.slug}" aria-pressed="false" aria-label="Comparer ${p.name}">${icon('plus')}</button></div>
  </article>`;
}

export function breadcrumbs(ctx) {
  const c = ctx.route.crumbs;
  return html`<nav class="r-crumbs" aria-label="Fil d’Ariane"><ol>${c.map((x, i) => (i === c.length - 1
    ? html`<li aria-current="page">${x.label}</li>` : html`<li><a href="${ctx.link(x.file)}">${x.label}</a></li>`))}</ol></nav>`;
}

export function pageHead(ctx, { label, h1, lead, extra = '' }) {
  return html`<section class="r-head" aria-labelledby="h1">
    <div class="r-wrap r-head__in">
      ${breadcrumbs(ctx)}
      ${kicker(null, label)}
      <h1 id="h1" class="r-h1" data-rise>${h1}</h1>
      ${lead ? html`<p class="r-lead" data-pop>${lead}</p>` : ''}
      ${extra}
    </div>
    <span class="r-head__ring" aria-hidden="true" data-spin></span>
  </section>`;
}

export function specTable(rows) {
  return html`<table class="r-specs"><tbody>${rows.map(([k, v]) => html`<tr><th scope="row">${k}</th><td>${v}</td></tr>`)}</tbody></table>`;
}

export function cta(ctx, { title = 'Parlons de votre projet.', text = 'Machine, surface, type de sol : décrivez votre besoin.', machine = '' } = {}) {
  const href = ctx.link('contact.html') + (machine ? `?machine=${machine}` : '');
  return html`<section class="r-cta" aria-labelledby="cta-title" data-porthole>
    <div class="r-cta__disc" data-porthole-disc></div>
    <div class="r-wrap r-cta__in">
      <h2 id="cta-title" class="r-h2" data-rise>${title}</h2>
      <p class="r-lead" data-pop>${text}</p>
      <div class="r-cta__actions" data-pop>${orbitCta(href)}<a class="r-link r-link--light" href="${ctx.asset('catalogue-grilloo-2024.pdf')}" download>Catalogue 2024 (PDF)</a></div>
    </div>
  </section>`;
}

// Cluster of overlapping round images floating in orbit (replaces single large photos).
export function cluster(ctx, ids, { cls = '' } = {}) {
  return html`<div class="r-cluster r-cluster--${ids.length} ${cls}">${ids.map((id, i) => html`<figure class="r-cluster__c r-cluster__c${i + 1}" data-mask="circle"><span class="r-cluster__fl" data-float="${10 - i * 2}">${genImg(ctx, id, '', 'r-cluster__img')}</span></figure>`)}<span class="r-cluster__dot" aria-hidden="true" data-float="6"></span><svg class="r-cluster__orbit" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="49"/></svg></div>`;
}
