// Rondeur — page shell (iris transitions overlay, round header pills).
import { html, raw } from '../../lib/html.mjs';
import { scriptTags, styleTags } from '../../lib/seo.mjs';
import { slimProducts } from '../../lib/client-data.mjs';
import { icon } from './components.mjs';

function header(ctx) {
  const cur = ctx.route.file;
  const nav = [['catalogue.html', 'Catalogue'], ['secteurs.html', 'Secteurs'], ['guide-de-choix.html', 'Guide'], ['robotclean-g-plus.html', 'RoboClean G+'], ['a-propos.html', 'À propos']];
  return html`<header class="r-header" data-header>
    <div class="r-wrap r-header__bar">
      <a class="r-logo" href="${ctx.link('index.html')}" aria-label="GRILLOO — accueil"><img src="${ctx.asset('img/brand/logo-mark-cyan.png')}" alt="GRILLOO" width="88" height="32"></a>
      <nav class="r-nav" aria-label="Navigation principale">
        <button class="r-nav__link" type="button" aria-expanded="false" aria-controls="r-ranges" data-ranges-toggle>Gammes</button>
        ${nav.map(([f, l]) => html`<a class="r-nav__link" href="${ctx.link(f)}" ${raw(cur === f ? 'aria-current="page"' : '')}>${l}</a>`)}
      </nav>
      <a class="r-btn r-btn--ink r-btn--sm r-header__cta" href="${ctx.link('contact.html')}"><span class="r-btn__txt">Devis</span></a>
      <button class="r-burger" type="button" aria-expanded="false" aria-controls="r-drawer" data-drawer-toggle><span class="sr">Menu</span>${icon('menu')}</button>
    </div>
    <div class="r-ranges" id="r-ranges" data-ranges hidden>
      <div class="r-wrap r-ranges__in">${ctx.data.gammes.map((g, i) => html`<a href="${ctx.link(`gammes/${g.slug}.html`)}"><span>${String(i + 1).padStart(2, '0')}</span>${g.name}</a>`)}<a href="${ctx.link('catalogue.html')}" class="r-ranges__all"><span>${ctx.data.products.length}</span>Tout le catalogue</a></div>
    </div>
    <div class="r-drawer" id="r-drawer" data-drawer hidden>
      <nav class="r-wrap" aria-label="Navigation mobile">
        ${ctx.data.gammes.map((g) => html`<a href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a>`)}
        <span class="r-drawer__sep" aria-hidden="true"></span>
        ${nav.map(([f, l]) => html`<a href="${ctx.link(f)}">${l}</a>`)}
        <a class="r-btn r-btn--ink" href="${ctx.link('contact.html')}"><span class="r-btn__txt">Demander un devis</span></a>
      </nav>
    </div>
  </header>`;
}

function footer(ctx) {
  const c = ctx.data.site.contact;
  return html`<footer class="r-footer">
    <div class="r-wrap">
      <div class="r-footer__top">
        <img class="r-footer__logo" src="${ctx.asset('img/brand/logo-lockup-cyan.png')}" alt="GRILLOO — Leader des solutions de nettoyage" width="200" height="99" loading="lazy">
        <p class="r-footer__claim">La puissance du nettoyage entre vos mains.</p>
      </div>
      <div class="r-footer__grid">
        <div><p class="r-footer__t">Gammes</p><ul>${ctx.data.gammes.map((g) => html`<li><a href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a></li>`)}</ul></div>
        <div><p class="r-footer__t">Explorer</p><ul>
          <li><a href="${ctx.link('catalogue.html')}">Catalogue</a></li><li><a href="${ctx.link('robotclean-g-plus.html')}">RoboClean G+</a></li><li><a href="${ctx.link('secteurs.html')}">Secteurs</a></li>
          <li><a href="${ctx.link('guide-de-choix.html')}">Guide de choix</a></li><li><a href="${ctx.link('guides/renover-sol-pierre.html')}">Rénover un sol en pierre</a></li><li><a href="${ctx.link('a-propos.html')}">À propos</a></li></ul></div>
        <div><p class="r-footer__t">Contact</p><ul class="r-footer__muted"><li>${c.address}</li><li>${c.phone}</li><li>${c.email}</li><li>Réseaux sociaux : ${ctx.data.site.todo}</li></ul></div>
        <div><p class="r-footer__t">Catalogue 2024</p><ul><li><a href="${ctx.asset('catalogue-grilloo-2024.pdf')}" download>Télécharger le PDF (11 Mo)</a></li></ul></div>
      </div>
      <p class="r-footer__base"><span>© ${new Date().getFullYear()} GRILLOO — Leader des solutions de nettoyage</span><span>Maroc</span></p>
    </div>
  </footer>`;
}

// Arrival half of the iris transition: if the previous page closed the iris (sessionStorage flag),
// start covered and let main.js open it. Failsafe: uncover after 2.2 s whatever happens.
const IRIS_BOOT = `<script>(function(d){try{if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!sessionStorage.getItem('r-iris'))return;sessionStorage.removeItem('r-iris');d.classList.add('r-iris-in');setTimeout(function(){d.classList.remove('r-iris-in')},2200)}catch(e){}})(document.documentElement)</script>`;

function compareTray() {
  return html`<div class="r-tray" data-compare-bar hidden><span class="r-tray__n"><span data-compare-count>0</span></span><span class="r-tray__list" data-compare-list></span>
    <button class="r-btn r-btn--ink r-btn--sm" type="button" data-compare-open><span class="r-btn__txt">Comparer</span></button><button class="r-tray__x" type="button" data-compare-clear aria-label="Vider">${icon('close')}</button></div>
  <dialog class="r-dialog" data-compare-dialog aria-label="Comparaison"><div class="r-dialog__head"><span class="r-kicker"><span class="r-kicker__dot r-kicker__dot--empty"></span>Comparaison</span><button type="button" data-compare-close aria-label="Fermer">${icon('close')}</button></div><div data-compare-table></div></dialog>`;
}

export function layout(ctx, body, { data = false, page = '' } = {}) {
  return html`<!doctype html>
<html lang="fr">
<head>
${ctx.head(styleTags(ctx))}
</head>
<body class="r-site r-page--${page || ctx.route.kind}">
<a class="r-skip" href="#main">Aller au contenu</a>
<div class="r-iris" aria-hidden="true" data-iris><span class="r-iris__mark"><img src="${ctx.asset('img/brand/logo-mark-cyan.png')}" alt="" width="88" height="32"></span></div>
${raw(IRIS_BOOT)}
${header(ctx)}
<main id="main">${body}</main>
${footer(ctx)}
<button class="r-top" type="button" aria-label="Revenir en haut de la page" data-top hidden><svg class="r-top__ring" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="28" class="r-top__track"/><circle cx="30" cy="30" r="28" pathLength="1" class="r-top__val" data-top-val/></svg>${icon('arrow', 'r-ico r-top__ico')}</button>
${data ? compareTray() : ''}
${data ? ctx.jsonScript('catalogue-data', slimProducts(ctx)) : ''}
${scriptTags(ctx)}
</body>
</html>`;
}
