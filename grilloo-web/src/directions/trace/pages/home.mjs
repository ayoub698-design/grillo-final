// Trace — Accueil.
import { html } from '../../../lib/html.mjs';
import { homeModel } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { eyebrow, button, icon, widthBand, floorTile, genImg, productImg, squeegeeArc, wetTrail, cta, MAX_WIDTH, strip } from '../components.mjs';
import { heroPicture } from '../../../lib/media.mjs';

function hero(ctx, m) {
  const pg = ctx.data.pages.home;
  const robot = ctx.data.products.find((p) => p.slug === 'roboclean-g-plus');
  return html`<section class="t-hero" aria-labelledby="h1" data-hero>
    <div class="t-hero__stage">
      <div class="t-hero__bg">${heroPicture(ctx, 'trace', 'Lobby en marbre blanc poli, vu au ras du sol')}</div>
      <canvas class="t-hero__haze" data-haze aria-hidden="true"></canvas>
      <div class="t-hero__static" aria-hidden="true"></div>
      <div class="t-hero__robot" data-robot>
        <img class="t-hero__rimg" src="${ctx.asset(`img/cut/${robot.img}.webp`)}" alt="Autolaveuse autonome GRILLOO RoboClean G+" fetchpriority="high">
        <img class="t-hero__rrefl" src="${ctx.asset(`img/cut/${robot.img}.webp`)}" alt="">
      </div>
      <span class="t-hero__fade" aria-hidden="true"></span>
      <div class="t-wrap t-hero__top">
        <p class="t-mono t-hero__meta" data-fog>Catalogue 2024 · ${m.totals.products} machines · ${m.totals.gammes} gammes</p>
        <h1 id="h1" class="t-display" data-dry>${pg.h1}</h1>
        <p class="t-mono t-hero__hint" aria-hidden="true">${icon('arrow')} Passez le curseur comme une raclette</p>
      </div>
      <p class="t-mono t-hero__tag" data-fog>GRILLOO RoboClean G+ · jusqu’à 2 365 m²/h en mode autonome</p>
    </div>
    <div class="t-wrap t-hero__foot">
      <p class="t-lead" data-fog>${fr(pg.intro)}</p>
      <div class="t-actions" data-fog>${button(ctx.link('catalogue.html'), 'Explorer le catalogue')}${button(ctx.link('contact.html'), 'Demander un devis', { variant: 'line' })}</div>
    </div>
  </section>`;
}

function passes(ctx, m) {
  return html`<section class="t-section t-passes" aria-labelledby="passes-title">
    <div class="t-wrap">
      ${eyebrow(1, 'Six gammes')}
      <h2 id="passes-title" class="t-h2" data-dry>Chaque surface a sa machine.</h2>
    </div>
    <ol class="t-passes__list">
      ${m.gammes.map((g, i) => {
        const r = g.ranges.productivity || g.ranges.tank || g.ranges.power;
        const unit = g.ranges.productivity ? 'm²/h' : g.ranges.tank ? 'L' : 'W';
        return html`<li class="t-pass" data-pass>
          <a class="t-wrap t-pass__in" href="${ctx.link(g.file)}">
            <span class="t-mono t-pass__idx">${String(i + 1).padStart(2, '0')}</span>
            <span class="t-pass__name">${g.g.name}</span>
            <span class="t-pass__meta"><span class="t-mono">${g.count} modèles</span>${r ? html`<span class="t-pass__range">${fmt(r.min)} → ${fmt(r.max)} <small>${unit}</small></span>` : ''}</span>
            <span class="t-pass__imgs" aria-hidden="true">${g.samples.slice(0, 2).map((p) => productImg(ctx, p.img, ''))}</span>
            <span class="t-pass__go">${icon('arrow')}</span>
          </a>
        </li>`;
      })}
    </ol>
  </section>`;
}

function widths(ctx) {
  const items = ctx.data.products.filter((p) => typeof p.key?.width === 'number' && ['autolaveuses', 'balayeuses'].includes(p.gamme)).sort((a, b) => a.key.width - b.key.width);
  return html`<section class="t-section t-widths" aria-labelledby="w-title">
    ${squeegeeArc('t-arc--mist')}
    <div class="t-widths__in">
      <div class="t-wrap">
        <div class="t-split">
          <div>${eyebrow(2, 'La trace')}<h2 id="w-title" class="t-h2" data-dry>La largeur de chaque passage.</h2></div>
          <p class="t-lead" data-fog>Chaque bande est à l’échelle : largeur de travail réelle des autolaveuses et balayeuses du catalogue, de ${fmt(items[0].key.width)} à ${fmt(MAX_WIDTH)} mm.</p>
        </div>
        <div class="t-widths__filter" role="group" aria-label="Filtrer">
          <button type="button" class="t-pill t-pill--ink" data-wfilter="" aria-pressed="true">Tout</button>
          <button type="button" class="t-pill" data-wfilter="autolaveuses" aria-pressed="false">Autolaveuses</button>
          <button type="button" class="t-pill" data-wfilter="balayeuses" aria-pressed="false">Balayeuses</button>
        </div>
        <ul class="t-widths__list">
          ${items.map((p) => html`<li data-wrow="${p.gamme}"><a href="${ctx.link(`produits/${p.slug}.html`)}"><span class="t-widths__name">${p.name}</span>${widthBand(p.key.width)}</a></li>`)}
        </ul>
      </div>
    </div>
  </section>`;
}

function robot(ctx, m) {
  const r = m.robot;
  return html`<section class="t-section t-robot" aria-labelledby="robot-title">
    <div class="t-wrap t-robot__grid">
      <div class="t-robot__visual" data-fog><div data-float="8">${floorTile(ctx, r.p.img, 'Autolaveuse autonome GRILLOO RoboClean G+', 't-floor--big')}</div></div>
      <div class="t-robot__text">
        ${eyebrow(3, 'Autonome et manuelle')}
        <h2 id="robot-title" class="t-h2" data-dry>RoboClean G+</h2>
        <p class="t-lead" data-fog>${fr(r.lead)}</p>
        <dl class="t-figs" data-fog>${r.figures.slice(0, 4).map((f) => html`<div><dt class="t-mono">${f.key === 'productivity' ? 'Max. mode autonome' : f.label}</dt><dd>${f.value}<small>${f.unit}</small></dd></div>`)}</dl>
        <div class="t-actions" data-fog>${button(ctx.link('robotclean-g-plus.html'), 'Découvrir RoboClean G+')}</div>
      </div>
    </div>
  </section>`;
}

function guide(ctx) {
  return html`<section class="t-section t-teaser" aria-labelledby="g-title">
    <div class="t-wrap">
      ${eyebrow(4, 'Guide de choix')}
      <h2 id="g-title" class="t-h2" data-dry>Combien de mètres carrés ?</h2>
      <form class="t-slide" data-teaser action="${ctx.link('guide-de-choix.html')}" method="get" data-fog>
        <input type="hidden" name="surfaceType" value="dur">
        <input type="hidden" name="hours" value="1">
        <label class="t-slide__label" for="t-area"><span class="t-mono">Surface de sol dur à nettoyer en une heure</span><output class="t-slide__val"><b data-teaser-area>2 500</b> m²</output></label>
        <input class="t-range" id="t-area" name="area" type="range" min="200" max="12000" step="100" value="2500">
        <div class="t-slide__out">
          <p><span class="t-mono">Rendement nécessaire</span><b data-teaser-needed>2 500</b><small>m²/h</small></p>
          <p><span class="t-mono">Machines du catalogue</span><b data-teaser-count>—</b></p>
          <button class="t-btn t-btn--ink" type="submit"><span class="t-btn__txt">Voir les machines</span>${icon('arrow', 't-btn__ico')}<span class="t-btn__drop" aria-hidden="true"></span></button>
        </div>
      </form>
    </div>
  </section>`;
}

function sectors(ctx, m) {
  return html`<section class="t-section t-hscroll" aria-labelledby="s-title" data-hscroll>
    <div class="t-wrap">${eyebrow(5, 'Secteurs')}<h2 id="s-title" class="t-h2" data-dry>Six environnements.</h2></div>
    <div class="t-hscroll__vp" data-hscroll-vp><div class="t-hscroll__track" data-hscroll-track>
      ${m.sectors.map((s, i) => html`<a class="t-hcard" href="${ctx.link('secteurs.html')}#${s.slug}">
        <span class="t-hcard__media">${genImg(ctx, s.img, '', 't-hcard__img')}</span>
        <span class="t-mono">${String(i + 1).padStart(2, '0')} · ${s.count} machines</span>
        <span class="t-hcard__name">${s.name}</span>
      </a>`)}
    </div></div>
  </section>`;
}

function beforeAfter(ctx) {
  return html`<section class="t-section t-ba-sec" aria-labelledby="ba-title">
    <div class="t-wrap t-split">
      <div>${eyebrow(6, 'Avant / après')}<h2 id="ba-title" class="t-h2" data-dry>Le propre, c’est la lumière.</h2></div>
      <p class="t-lead" data-fog>Faites glisser la raclette. Illustration : un sol en terrazzo voilé de poussière, puis nettoyé.</p>
    </div>
    <div class="t-wrap">
      <div class="t-ba" data-ba style="--pos:50%">
        ${genImg(ctx, 'tex-terrazzo-propre', 'Sol en terrazzo propre (illustration)', 't-ba__img')}
        <div class="t-ba__dirty" aria-hidden="true">${genImg(ctx, 'tex-terrazzo-propre', '', 't-ba__img')}</div>
        <span class="t-ba__tag t-mono t-ba__tag--l">Avant</span><span class="t-ba__tag t-mono t-ba__tag--r">Après</span>
        <input class="t-ba__range" type="range" min="0" max="100" value="50" aria-label="Comparer avant et après" data-ba-range>
        <span class="t-ba__handle" aria-hidden="true"><i></i></span>
      </div>
    </div>
  </section>`;
}

function values(ctx, m) {
  return html`<section class="t-section t-values" aria-labelledby="v-title">
    <div class="t-wrap">
      ${eyebrow(7, 'Engagements')}
      <h2 id="v-title" class="sr">Sept engagements</h2>
      <ol class="t-values__list">${m.values.map((v, i) => html`<li class="t-value${i % 2 ? ' t-value--r' : ''}" data-fog><span class="t-mono">${String(i + 1).padStart(2, '0')}</span><h3 class="t-value__t">${v.title}</h3><p>${fr(v.text)}</p></li>`)}</ol>
    </div>
  </section>`;
}

function stone(ctx, m) {
  return html`${wetTrail()}<section class="t-section t-stone" aria-labelledby="st-title">
    <div class="t-wrap t-split">
      <div>${eyebrow(8, 'Ressource')}<h2 id="st-title" class="t-h3" data-dry>Rénover un sol en pierre, en 7 passages.</h2><a class="t-link" href="${ctx.link('guides/renover-sol-pierre.html')}" data-fog>Lire le guide</a></div>
      <ol class="t-stone__steps" data-fog>${m.steps.map((s) => html`<li><span class="t-mono">${String(s.n).padStart(2, '0')}</span>${s.title}</li>`)}</ol>
    </div>
  </section>`;
}

export function renderHome(ctx) {
  const m = homeModel(ctx.data);
  return layout(ctx, html`${hero(ctx, m)}${passes(ctx, m)}${widths(ctx)}${robot(ctx, m)}${guide(ctx)}${sectors(ctx, m)}${beforeAfter(ctx)}${values(ctx, m)}${stone(ctx, m)}${cta(ctx)}`, { data: true, overlay: true });
}
