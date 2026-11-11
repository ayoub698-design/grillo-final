// Trace — shared markup (le reflet et la buée).
import { html, raw } from '../../lib/html.mjs';
import { ICON_PATHS } from '../../lib/icon-paths.mjs';
import { fmt } from '../../lib/format.mjs';

export const MAX_WIDTH = 2100; // largest working width in the catalogue (GBE1200), mm

export function icon(name, cls = 't-ico') {
  return raw(`<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ''}</svg>`);
}

export const mono = (text, cls = '') => html`<span class="t-mono ${cls}">${text}</span>`;

// Eyebrow: mono index + label, with a reflection line.
export function eyebrow(index, label) {
  return html`<p class="t-eyebrow" data-fog>${index !== null ? html`<span>${String(index).padStart(2, '0')}</span>` : ''}${label}<i class="t-eyebrow__line" aria-hidden="true"></i></p>`;
}

// Pill button with a squeegee "wipe" fill on hover.
export function button(href, text, { variant = 'ink', iconName = 'arrow', attrs = '' } = {}) {
  return html`<a class="t-btn t-btn--${variant}" href="${href}" ${raw(attrs)}><span class="t-btn__txt">${text}</span>${iconName ? icon(iconName, 't-btn__ico') : ''}<span class="t-btn__drop" aria-hidden="true"></span></a>`;
}

// Curved squeegee blade edge at the top of a section (fill = section background).
export const squeegeeArc = (cls = '') => raw(`<svg class="t-arc ${cls}" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80 L0 22 Q720 -18 1440 22 L1440 80 Z"/></svg>`);
// Wet trail band that dries as it scrolls.
export const wetTrail = () => raw('<div class="t-trail" aria-hidden="true" data-trail><span></span></div>');

// Working-width band: proportional to the machine's real working width.
export function widthBand(w, { label = true } = {}) {
  if (typeof w !== 'number') return '';
  const pct = Math.max(6, Math.round((w / MAX_WIDTH) * 1000) / 10);
  return html`<div class="t-band" style="--w:${pct}%" data-band-w>${label ? html`<span class="t-band__label">${fmt(w)} mm</span>` : ''}<span class="t-band__bar"></span></div>`;
}

export const productImg = (ctx, img, alt, cls = '', eager = false) =>
  html`<img class="${cls}" src="${ctx.asset(`img/cut/${img}.webp`)}" alt="${alt}" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"')}>`;
export const genImg = (ctx, id, alt, cls = '', eager = false) =>
  html`<img class="${cls}" src="${ctx.asset(`img/gen/${id}.webp`)}" alt="${alt}" ${raw(eager ? '' : 'loading="lazy" decoding="async"')}>`;

// Product on a floor tile with its reflection.
export function floorTile(ctx, img, alt, cls = '', eager = false) {
  return html`<div class="t-floor ${cls}"><div class="t-floor__obj">${productImg(ctx, img, alt, 't-floor__img', eager)}${productImg(ctx, img, '', 't-floor__refl')}</div></div>`;
}

export function productCard(ctx, p, figures) {
  const href = ctx.link(`produits/${p.slug}.html`);
  return html`<article class="t-card" data-fog>
    <a href="${href}" class="t-card__media" tabindex="-1" aria-hidden="true">${floorTile(ctx, p.img, '')}</a>
    <div class="t-card__body">
      <p class="t-mono t-card__kind">${p.kind}</p>
      <h3 class="t-card__name"><a href="${href}">${p.name}</a></h3>
      ${widthBand(p.key?.width)}
      ${figures.length ? html`<ul class="t-card__figs">${figures.map((f) => html`<li><span class="t-mono">${f.label}</span><b>${f.value}</b> <small>${f.unit}</small></li>`)}</ul>` : ''}
      <div class="t-card__actions"><a class="t-link" href="${href}">Voir la fiche</a><button class="t-cmp" type="button" data-compare-add="${p.slug}" aria-pressed="false">${icon('plus', 't-cmp__ico')}<span>Comparer</span></button></div>
    </div>
  </article>`;
}

export function breadcrumbs(ctx) {
  const c = ctx.route.crumbs;
  return html`<nav class="t-crumbs t-mono" aria-label="Fil d’Ariane"><ol>${c.map((x, i) => (i === c.length - 1
    ? html`<li aria-current="page">${x.label}</li>` : html`<li><a href="${ctx.link(x.file)}">${x.label}</a></li>`))}</ol></nav>`;
}

export function pageHead(ctx, { label, h1, lead, aside = '' }) {
  return html`<section class="t-head" aria-labelledby="h1">
    <div class="t-wrap">
      ${breadcrumbs(ctx)}
      ${eyebrow(null, label)}
      <h1 id="h1" class="t-h1" data-dry>${h1}</h1>
      <div class="t-head__row">${lead ? html`<p class="t-lead" data-fog>${lead}</p>` : ''}${aside}</div>
    </div>
  </section>`;
}

export function specTable(rows) {
  return html`<table class="t-specs"><tbody>${rows.map(([k, v]) => html`<tr><th scope="row">${k}</th><td>${v}</td></tr>`)}</tbody></table>`;
}

export function cta(ctx, { title = 'Parlons de votre surface.', text = 'Machine, surface, type de sol : décrivez votre besoin, nous vous orientons vers la machine adaptée.', machine = '' } = {}) {
  const href = ctx.link('contact.html') + (machine ? `?machine=${machine}` : '');
  return html`<section class="t-cta" aria-labelledby="cta-title">
    ${squeegeeArc('t-arc--mist')}
    <div class="t-cta__in">
      <div class="t-wrap t-cta__grid">
        <h2 id="cta-title" class="t-h2" data-dry>${title}</h2>
        <div class="t-cta__side">
          <p class="t-lead" data-fog>${text}</p>
          <div class="t-actions" data-fog>${button(href, 'Demander un devis')}${button(ctx.asset('catalogue-grilloo-2024.pdf'), 'Catalogue PDF', { variant: 'line', iconName: 'download', attrs: 'download' })}</div>
        </div>
      </div>
    </div>
  </section>`;
}

// Film strip of several images (replaces single large photos).
export function strip(ctx, ids, { caption = 'Illustrations' } = {}) {
  return html`<div class="t-strip t-strip--${ids.length}">${ids.map((id, i) => html`<figure class="t-strip__f t-strip__f${i + 1}" data-fog><span class="t-strip__in" data-parallax="${0.06 + i * 0.03}">${genImg(ctx, id, '', 't-strip__img')}</span></figure>`)}<span class="t-strip__glint" aria-hidden="true"></span><p class="t-mono t-strip__cap">${caption}</p></div>`;
}
