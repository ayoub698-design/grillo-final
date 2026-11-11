// Étiquette — shared markup components (cartel de précision).
import { html, raw } from '../../lib/html.mjs';
import { icon } from './icons.mjs';

const pad = (n) => String(n).padStart(2, '0');

// Section header row: index · ink label chip · hairline that draws.
export function cartel(index, label, extra = '') {
  return html`<div class="e-cartel" data-reveal>
    ${index !== null ? html`<span class="e-cartel__idx">${pad(index)}</span>` : ''}
    <span class="e-tag" data-print>${label}</span>
    <span class="e-cartel__rule" data-rule></span>
    ${extra ? html`<span class="e-cartel__extra">${extra}</span>` : ''}
  </div>`;
}

export const tag = (text, cls = '') => html`<span class="e-tag ${cls}">${text}</span>`;
export const label = (text) => html`<span class="e-label">${text}</span>`;

// Hairline with a 60° triangular notch (the catalogue cover triangle).
export function notchRule(x = '33%') {
  return html`<div class="e-notch" style="--x:${x}" aria-hidden="true"><span class="e-notch__line" data-rule></span><span class="e-notch__tri" data-notch></span></div>`;
}

// Perforated tear line before CTAs (coupon).
export const tearLine = () => raw('<div class="e-tear" aria-hidden="true"><span></span></div>');

export function button(href, text, { variant = 'ink', iconName = 'arrow', attrs = '' } = {}) {
  return html`<a class="e-btn e-btn--${variant}" href="${href}" ${raw(attrs)}><span class="e-btn__txt">${text}</span>${iconName ? icon(iconName, 'e-btn__ico') : ''}</a>`;
}

// Big condensed figure: value + unit + label.
export function figure({ value, unit, label: l }, cls = '') {
  return html`<div class="e-fig ${cls}"><p class="e-fig__v"><span>${value}</span>${unit ? html`<small>${unit}</small>` : ''}</p><p class="e-label">${l}</p></div>`;
}

export const productImg = (ctx, img, alt, cls = '', eager = false) =>
  html`<img class="${cls}" src="${ctx.asset(`img/cut/${img}.webp`)}" alt="${alt}" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"')}>`;

export const genImg = (ctx, id, alt, cls = '', eager = false) =>
  html`<img class="${cls}" src="${ctx.asset(`img/gen/${id}.webp`)}" alt="${alt}" ${raw(eager ? '' : 'loading="lazy" decoding="async"')}>`;

// Product card (server render). The same markup is produced client-side in main.js (renderCard).
export function productCard(ctx, p, figures, { compare = true } = {}) {
  const href = ctx.link(`produits/${p.slug}.html`);
  return html`<article class="e-card" data-reveal>
    <a class="e-card__media" href="${href}" tabindex="-1" aria-hidden="true">${productImg(ctx, p.img, '', 'e-card__img')}<span class="e-card__kind">${p.kind}</span></a>
    <div class="e-card__body">
      <h3 class="e-card__name"><a href="${href}"><span class="e-card__brand">GRILLOO</span> ${p.name}</a></h3>
      ${figures.length ? html`<dl class="e-card__figs">${figures.map((f) => html`<div><dt>${f.label}</dt><dd>${f.value}<small>${f.unit}</small></dd></div>`)}</dl>` : html`<p class="e-card__none">${p.kind}</p>`}
      <div class="e-card__actions">
        <a class="e-link" href="${href}">Fiche technique ${icon('arrow', 'e-link__ico')}</a>
        ${compare ? html`<button class="e-cmp" type="button" data-compare-add="${p.slug}" aria-pressed="false">${icon('plus', 'e-cmp__ico')}<span>Comparer</span></button>` : ''}
      </div>
    </div>
  </article>`;
}

export function breadcrumbs(ctx) {
  const c = ctx.route.crumbs;
  return html`<nav class="e-crumbs" aria-label="Fil d’Ariane"><ol>${c.map((x, i) => (i === c.length - 1
    ? html`<li aria-current="page">${x.label}</li>`
    : html`<li><a href="${ctx.link(x.file)}">${x.label}</a></li>`))}</ol></nav>`;
}

// Coupon CTA closing most pages.
export function ctaCoupon(ctx, { title = 'Demander un devis', text = 'Décrivez votre surface et votre type de sol : nous vous orientons vers la machine adaptée.', machine = '' } = {}) {
  const href = ctx.link('contact.html') + (machine ? `?machine=${machine}` : '');
  return html`<section class="e-section e-coupon-wrap" aria-labelledby="cta-title">
    <div class="e-wrap">
      ${tearLine()}
      <div class="e-coupon" data-reveal>
        <div class="e-coupon__head">${tag('Devis')}<h2 id="cta-title" class="e-h2" data-split>${title}</h2></div>
        <p class="e-lead">${text}</p>
        <div class="e-coupon__actions">
          ${button(href, 'Demander un devis')}
          ${button(ctx.asset('catalogue-grilloo-2024.pdf'), 'Catalogue 2024 (PDF, 11 Mo)', { variant: 'line', iconName: 'download', attrs: 'download' })}
        </div>
      </div>
    </div>
  </section>`;
}

// Specification table (zebra hairlines). data-dim links a row to a dimension line on the photo.
export function specTable(rows, { dimKeys = {} } = {}) {
  return html`<table class="e-specs"><tbody>${rows.map(([k, v]) => {
    const dim = Object.entries(dimKeys).find(([, re]) => re.test(k));
    return html`<tr ${raw(dim ? `data-dim="${dim[0]}"` : '')}><th scope="row">${k}</th><td>${v}</td></tr>`;
  })}</tbody></table>`;
}

// Asymmetric mosaic (replaces single large images). items: gen-image ids or { product } objects.
export function mosaic(ctx, items, { caption = 'Mises en situation — illustrations', cls = '' } = {}) {
  const tile = (it, i) => {
    const pos = ['a', 'b', 'c'][i] || 'c';
    if (typeof it === 'object' && it.product) {
      const p = it.product;
      return html`<figure class="e-mosaic__t e-mosaic__${pos} e-mosaic__prod" data-mask="${i % 2 ? 'left' : 'up'}"><span class="e-mosaic__float" data-float="7">${productImg(ctx, p.img, `GRILLOO ${p.name}`, 'e-mosaic__pimg')}</span><figcaption class="e-label">GRILLOO ${p.name}</figcaption></figure>`;
    }
    return html`<figure class="e-mosaic__t e-mosaic__${pos}" data-mask="${i % 2 ? 'left' : 'up'}"><span class="e-mosaic__in" data-parallax="0.07">${genImg(ctx, it, '', 'e-mosaic__img')}</span></figure>`;
  };
  return html`<div class="e-mosaic e-mosaic--${items.length} ${cls}">${items.map(tile)}<p class="e-caption e-mosaic__cap"><span class="e-caption__fig">Illustrations</span> ${caption}</p></div>`;
}

// Slow marquee of model names (decorative, duplicated for a seamless loop).
export function marquee(names) {
  const row = names.map((n) => html`<span>${n}</span><i aria-hidden="true"></i>`);
  return html`<div class="e-marquee" aria-hidden="true"><div class="e-marquee__track">${row}${row}</div></div>`;
}
