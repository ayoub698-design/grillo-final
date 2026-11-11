// Trace — page shell.
import { html, raw } from '../../lib/html.mjs';
import { scriptTags, styleTags } from '../../lib/seo.mjs';
import { slimProducts } from '../../lib/client-data.mjs';
import { icon } from './components.mjs';

function header(ctx, overlay) {
  const cur = ctx.route.file;
  const nav = [['catalogue.html', 'Catalogue'], ['secteurs.html', 'Secteurs'], ['guide-de-choix.html', 'Guide de choix'], ['robotclean-g-plus.html', 'RoboClean G+'], ['a-propos.html', 'À propos']];
  return html`<header class="t-header${overlay ? ' t-header--overlay' : ''}" data-header>
    <div class="t-wrap t-header__bar">
      <a class="t-logo" href="${ctx.link('index.html')}" aria-label="GRILLOO — accueil"><img src="${ctx.asset('img/brand/logo-mark-cyan.png')}" alt="GRILLOO" width="88" height="32"></a>
      <nav class="t-nav" aria-label="Navigation principale">
        <div class="t-nav__group">
          <button class="t-nav__link" type="button" aria-expanded="false" aria-controls="t-ranges" data-ranges-toggle>Gammes</button>
          <div class="t-ranges" id="t-ranges" data-ranges hidden>${ctx.data.gammes.map((g) => html`<a href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a>`)}<a class="t-ranges__all" href="${ctx.link('catalogue.html')}">Tout le catalogue</a></div>
        </div>
        ${nav.map(([f, l]) => html`<a class="t-nav__link" href="${ctx.link(f)}" ${raw(cur === f ? 'aria-current="page"' : '')}>${l}</a>`)}
      </nav>
      <a class="t-pill" href="${ctx.link('contact.html')}">Devis</a>
      <button class="t-burger" type="button" aria-expanded="false" aria-controls="t-drawer" data-drawer-toggle><span class="sr">Menu</span><i></i><i></i></button>
    </div>
    <div class="t-drawer" id="t-drawer" data-drawer hidden>
      <nav class="t-wrap" aria-label="Navigation mobile">
        ${ctx.data.gammes.map((g) => html`<a href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a>`)}
        <hr>
        ${nav.map(([f, l]) => html`<a href="${ctx.link(f)}">${l}</a>`)}
        <a class="t-pill t-pill--big" href="${ctx.link('contact.html')}">Demander un devis</a>
      </nav>
    </div>
  </header>`;
}

function footer(ctx) {
  const c = ctx.data.site.contact;
  return html`<footer class="t-footer">
    <div class="t-wrap">
      <p class="t-footer__claim" data-dry>La puissance du nettoyage entre vos mains.</p>
      <div class="t-footer__grid">
        <div><img class="t-footer__logo" src="${ctx.asset('img/brand/logo-lockup-cyan.png')}" alt="GRILLOO — Leader des solutions de nettoyage" width="180" height="89" loading="lazy"></div>
        <div><p class="t-mono">Gammes</p><ul>${ctx.data.gammes.map((g) => html`<li><a href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a></li>`)}</ul></div>
        <div><p class="t-mono">Explorer</p><ul>
          <li><a href="${ctx.link('catalogue.html')}">Catalogue</a></li><li><a href="${ctx.link('robotclean-g-plus.html')}">RoboClean G+</a></li>
          <li><a href="${ctx.link('secteurs.html')}">Secteurs</a></li><li><a href="${ctx.link('guide-de-choix.html')}">Guide de choix</a></li>
          <li><a href="${ctx.link('guides/renover-sol-pierre.html')}">Rénover un sol en pierre</a></li><li><a href="${ctx.link('a-propos.html')}">À propos</a></li></ul></div>
        <div><p class="t-mono">Contact</p><ul class="t-footer__muted"><li>${c.address}</li><li>${c.phone}</li><li>${c.email}</li><li>Réseaux sociaux : ${ctx.data.site.todo}</li>
          <li><a href="${ctx.asset('catalogue-grilloo-2024.pdf')}" download>Catalogue 2024 (PDF)</a></li></ul></div>
      </div>
      <div class="t-footer__base t-mono"><span>© ${new Date().getFullYear()} GRILLOO</span><span>Leader des solutions de nettoyage — Maroc</span></div>
    </div>
  </footer>`;
}

function compareTray() {
  return html`<div class="t-tray" data-compare-bar hidden><span class="t-mono"><span data-compare-count>0</span>/3</span><span class="t-tray__list" data-compare-list></span>
    <button class="t-pill t-pill--ink" type="button" data-compare-open>Comparer</button><button class="t-tray__x" type="button" data-compare-clear aria-label="Vider">${icon('close')}</button></div>
  <dialog class="t-dialog" data-compare-dialog aria-label="Comparaison"><div class="t-dialog__head"><span class="t-mono">Comparaison</span><button type="button" data-compare-close aria-label="Fermer">${icon('close')}</button></div><div data-compare-table></div></dialog>`;
}

export function layout(ctx, body, { data = false, overlay = false, page = '' } = {}) {
  return html`<!doctype html>
<html lang="fr">
<head>
${ctx.head(styleTags(ctx))}
</head>
<body class="t-site t-page--${page || ctx.route.kind}">
<a class="t-skip" href="#main">Aller au contenu</a>
<div class="t-veil" aria-hidden="true" data-veil><div class="t-veil__panel"><span class="t-veil__mark"><img src="${ctx.asset('img/brand/logo-mark-cyan.png')}" alt="" width="88" height="32"></span></div></div>
<span class="t-progress" aria-hidden="true" data-progress></span>
${header(ctx, overlay)}
<main id="main">${body}</main>
${footer(ctx)}
${data ? compareTray() : ''}
${data ? ctx.jsonScript('catalogue-data', slimProducts(ctx)) : ''}
${scriptTags(ctx)}
</body>
</html>`;
}
