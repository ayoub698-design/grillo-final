// Étiquette — page shell: header (mega menu), main, footer, comparator tray, scripts.
import { html, raw } from '../../lib/html.mjs';
import { scriptTags, styleTags } from '../../lib/seo.mjs';
import { slimProducts } from '../../lib/client-data.mjs';
import { gammeModel } from '../../lib/view-models.mjs';
import { fmt } from '../../lib/format.mjs';
import { icon } from './icons.mjs';
import { productImg } from './components.mjs';

function megaMenu(ctx) {
  return html`<div class="e-mega" id="e-mega" data-mega hidden>
    <div class="e-wrap e-mega__grid">
      ${ctx.data.gammes.map((g, i) => {
        const m = gammeModel(ctx.data, g.slug);
        const r = m.ranges.productivity;
        return html`<a class="e-mega__item" href="${ctx.link(m.file)}">
          <span class="e-mega__idx">${String(i + 1).padStart(2, '0')}</span>
          <span class="e-mega__name">${g.name}</span>
          <span class="e-label">${m.count} modèles${r ? html` · ${fmt(r.min)}–${fmt(r.max)} m²/h` : ''}</span>
          <span class="e-mega__thumbs">${m.items.slice(0, 3).map((p) => productImg(ctx, p.img, ''))}</span>
        </a>`;
      })}
      <a class="e-mega__all" href="${ctx.link('catalogue.html')}"><span>Tout le catalogue</span><span class="e-label">${ctx.data.products.length} machines</span>${icon('arrow')}</a>
    </div>
  </div>`;
}

function header(ctx) {
  const cur = ctx.route.file;
  const nav = ctx.data.site.nav.filter((n) => !n.mega);
  return html`<header class="e-header" data-header>
    <div class="e-wrap e-header__bar">
      <a class="e-logo" href="${ctx.link('index.html')}" aria-label="GRILLOO — accueil"><img src="${ctx.asset('img/brand/logo-mark-cyan.png')}" alt="GRILLOO" width="88" height="32"></a>
      <nav class="e-nav" aria-label="Navigation principale">
        <button class="e-nav__link e-nav__mega" type="button" aria-expanded="false" aria-controls="e-mega" data-mega-toggle>Gammes ${icon('arrow-down', 'e-nav__chev')}</button>
        ${nav.map((n) => html`<a class="e-nav__link" href="${ctx.link(n.file)}" ${raw(cur === n.file ? 'aria-current="page"' : '')}>${n.label}</a>`)}
      </nav>
      <a class="e-btn e-btn--ink e-btn--sm e-header__cta" href="${ctx.link('contact.html')}"><span class="e-btn__txt">Demander un devis</span>${icon('arrow', 'e-btn__ico')}</a>
      <button class="e-burger" type="button" aria-expanded="false" aria-controls="e-drawer" data-drawer-toggle><span class="sr">Menu</span>${icon('menu')}</button>
    </div>
    ${megaMenu(ctx)}
    <div class="e-drawer" id="e-drawer" data-drawer hidden>
      <nav class="e-wrap" aria-label="Navigation mobile">
        <p class="e-label">Gammes</p>
        ${ctx.data.gammes.map((g) => html`<a href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a>`)}
        <p class="e-label">Pages</p>
        ${nav.map((n) => html`<a href="${ctx.link(n.file)}">${n.label}</a>`)}
        <a class="e-btn e-btn--ink" href="${ctx.link('contact.html')}"><span class="e-btn__txt">Demander un devis</span>${icon('arrow', 'e-btn__ico')}</a>
      </nav>
    </div>
  </header>`;
}

function footer(ctx) {
  const c = ctx.data.site.contact;
  return html`<footer class="e-footer">
    <div class="e-wrap">
      <div class="e-footer__top">
        <img class="e-footer__logo" src="${ctx.asset('img/brand/logo-lockup-cyan.png')}" alt="GRILLOO — Leader des solutions de nettoyage" width="200" height="99" loading="lazy">
        <p class="e-footer__claim">La puissance du nettoyage entre vos mains.</p>
      </div>
      <div class="e-footer__cols">
        <div><p class="e-label">Gammes</p><ul>${ctx.data.gammes.map((g) => html`<li><a href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a></li>`)}</ul></div>
        <div><p class="e-label">Explorer</p><ul>
          <li><a href="${ctx.link('catalogue.html')}">Catalogue</a></li>
          <li><a href="${ctx.link('robotclean-g-plus.html')}">RoboClean G+</a></li>
          <li><a href="${ctx.link('secteurs.html')}">Secteurs</a></li>
          <li><a href="${ctx.link('guide-de-choix.html')}">Guide de choix</a></li>
          <li><a href="${ctx.link('guides/renover-sol-pierre.html')}">Rénover un sol en pierre</a></li>
          <li><a href="${ctx.link('a-propos.html')}">À propos</a></li>
        </ul></div>
        <div><p class="e-label">Contact</p><ul class="e-footer__contact">
          <li>${c.address}</li><li>${c.phone}</li><li>${c.email}</li><li>${c.hours}</li>
          <li><a href="${ctx.link('contact.html')}">Demander un devis</a></li>
        </ul></div>
        <div><p class="e-label">Catalogue 2024</p><ul>
          <li><a href="${ctx.asset('catalogue-grilloo-2024.pdf')}" download>Télécharger le PDF (11 Mo)</a></li>
          <li class="e-footer__social">Réseaux sociaux : ${ctx.data.site.todo}</li>
        </ul></div>
      </div>
      <div class="e-footer__base"><span>© ${new Date().getFullYear()} GRILLOO — Leader des solutions de nettoyage</span><span>Maroc</span></div>
    </div>
  </footer>`;
}

function compareTray() {
  return html`<div class="e-tray" data-compare-bar hidden>
    <div class="e-tray__in"><span class="e-tag"><span data-compare-count>0</span> / 3</span><span class="e-tray__list" data-compare-list></span>
      <button class="e-btn e-btn--ink e-btn--sm" type="button" data-compare-open><span class="e-btn__txt">Comparer</span></button>
      <button class="e-tray__clear" type="button" data-compare-clear>Vider</button></div>
  </div>
  <dialog class="e-dialog" data-compare-dialog aria-label="Comparaison">
    <div class="e-dialog__head"><span class="e-tag">Comparaison</span><button type="button" class="e-dialog__close" data-compare-close aria-label="Fermer">${icon('close')}</button></div>
    <div data-compare-table></div>
  </dialog>`;
}

// body: inner main html. opts.data: inline catalogue JSON for client scripts. opts.page: body class.
export function layout(ctx, body, { data = false, page = '' } = {}) {
  return html`<!doctype html>
<html lang="fr">
<head>
${ctx.head(styleTags(ctx))}
</head>
<body class="e-site e-page--${page || ctx.route.kind}">
<a class="e-skip" href="#main">Aller au contenu</a>
${header(ctx)}
<main id="main">${body}</main>
${footer(ctx)}
${data ? compareTray() : ''}
${data ? ctx.jsonScript('catalogue-data', slimProducts(ctx)) : ''}
${scriptTags(ctx)}
</body>
</html>`;
}
