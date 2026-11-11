// Trace — Accueil.
import { html } from '../../../lib/html.mjs';
import { homeModel } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { eyebrow, button, icon, widthBand, floorTile, genImg, productImg, squeegeeArc, wetTrail, cta, MAX_WIDTH, strip } from '../components.mjs';
import { heroPicture } from '../../../lib/media.mjs';

// Hero: the title stands on the horizon of a polished marble floor; its reflection lies on the floor,
// under a dust haze that the cursor (and the RoboClean driving in) wipes away like a squeegee.
function hero(ctx, m) {
  const pg = ctx.data.pages.home;
  const robot = ctx.data.products.find((p) => p.slug === 'roboclean-g-plus');
  const src = ctx.asset(`img/cut/${robot.img}.webp`);
  const callouts = [
    { k: 'productivity', label: 'Rendement max. en mode autonome', unit: 'm²/h' },
    { k: 'width', label: 'Largeur de travail', unit: 'mm' },
  ].filter((c) => typeof robot.key?.[c.k] === 'number');
  return html`<section class="t-hero" aria-labelledby="h1" data-hero>
    <div class="t-hero__stage" data-hero-stage>
      <div class="t-hero__bg" data-hero-bg>${heroPicture(ctx, 'trace', 'Lobby en marbre blanc poli, vu au ras du sol')}</div>
      <div class="t-wrap t-hero__mirror" aria-hidden="true"><p class="t-display">${pg.h1}</p></div>
      <canvas class="t-hero__haze" data-haze aria-hidden="true"></canvas>
      <div class="t-hero__static" aria-hidden="true"></div>
      <span class="t-hero__fade" aria-hidden="true"></span>
      <span class="t-hero__floorfade" aria-hidden="true"></span>
      <div class="t-hero__robot" data-robot>
        <img class="t-hero__rimg" src="${src}" alt="Autolaveuse autonome GRILLOO RoboClean G+" fetchpriority="high">
        <img class="t-hero__rrefl" src="${src}" alt="">
        <ul class="t-hero__callouts">${callouts.map((c, i) => html`<li class="t-hero__callout t-hero__callout--${i + 1}" data-callout><i aria-hidden="true"></i><span class="t-mono">${c.label}</span><b>${fmt(robot.key[c.k])}<small>${c.unit}</small></b></li>`)}</ul>
      </div>
      <div class="t-wrap t-hero__top" data-hero-top>
        <p class="t-mono t-hero__meta" data-hero-in><span class="t-hero__dot" aria-hidden="true"></span>Catalogue 2024 · ${m.totals.products} machines · ${m.totals.gammes} gammes</p>
        <h1 id="h1" class="t-display t-hero__title" data-hero-title>${pg.h1}</h1>
      </div>
      <p class="t-mono t-hero__hint" aria-hidden="true" data-hero-in><span class="t-hero__blade-ico"></span>Passez le curseur comme une raclette</p>
      <span class="t-hero__cursor" aria-hidden="true" data-hero-cursor><i></i></span>
    </div>
    <div class="t-wrap t-hero__foot">
      <p class="t-lead" data-hero-in>${fr(pg.intro)}</p>
      <div class="t-actions" data-hero-in>${button(ctx.link('catalogue.html'), 'Explorer le catalogue')}${button(ctx.link('contact.html'), 'Demander un devis', { variant: 'line' })}</div>
      <a class="t-hero__scroll t-mono" href="#passes-title" data-hero-in aria-label="Aller aux gammes"><span>Défiler</span><i aria-hidden="true"></i></a>
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

const pad = (n) => String(n).padStart(2, '0');

// Secteurs: a list of six places; a sticky "window" on the floor shows the active one,
// each new image swept in by a curved squeegee edge. Scroll, hover or focus selects.
function sectors(ctx, m) {
  const n = m.sectors.length;
  return html`<section class="t-section t-secs" aria-labelledby="s-title" data-secs>
    <div class="t-wrap">
      <div class="t-secs__head">
        <div>${eyebrow(5, 'Secteurs')}<h2 id="s-title" class="t-h2" data-dry>Six environnements.</h2></div>
        <p class="t-lead" data-fog>Pour chaque type de lieu, les machines que le catalogue GRILLOO recommande.</p>
      </div>
      <div class="t-secs__grid">
        <div class="t-secs__col">
          <span class="t-secs__wet" aria-hidden="true" data-secs-wet></span>
          <ol class="t-secs__list">
            ${m.sectors.map((s, i) => html`<li class="t-sec${i === 0 ? ' is-active' : ''}" data-sec="${i}">
              <a class="t-sec__link" href="${ctx.link('secteurs.html')}#${s.slug}">
                <span class="t-mono t-sec__idx">${pad(i + 1)}</span>
                <span class="t-sec__name">${s.name}</span>
                <span class="t-sec__count"><b>${s.count}</b><span class="t-mono">machines</span></span>
                <span class="t-sec__go">${icon('arrow')}</span>
              </a>
              <div class="t-sec__more">
                <span class="t-sec__m">${genImg(ctx, s.img, '', 't-sec__mimg')}</span>
                <p class="t-sec__intro">${fr(s.intro)}</p>
              </div>
            </li>`)}
          </ol>
        </div>
        <div class="t-secs__winwrap">
          <div class="t-secs__win" aria-hidden="true" data-secs-win data-sheen>
            ${m.sectors.map((s, i) => html`<figure class="t-secs__slide${i === 0 ? ' is-active' : ''}" data-sec-slide="${i}">
              <span class="t-secs__frame">${genImg(ctx, s.img, '', 't-secs__img')}</span>
              <figcaption class="t-secs__cap"><span class="t-mono">${pad(i + 1)} / ${pad(n)} · ${s.count} machines</span><span class="t-secs__capname">${s.name}</span><span class="t-secs__capintro">${fr(s.intro)}</span></figcaption>
            </figure>`)}
            <span class="t-mono t-secs__ill">Illustration</span>
            <span class="t-secs__ticks">${m.sectors.map((s, i) => html`<i class="${i === 0 ? 'is-on' : ''}" data-sec-tick="${i}"></i>`)}</span>
          </div>
        </div>
      </div>
    </div>
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
        <div class="t-ba__dirty" aria-hidden="true">${genImg(ctx, 'tex-terrazzo-sale', '', 't-ba__img')}</div>
        <span class="t-ba__tag t-mono t-ba__tag--l">Avant</span><span class="t-ba__tag t-mono t-ba__tag--r">Après</span>
        <input class="t-ba__range" type="range" min="0" max="100" value="50" aria-label="Comparer avant et après" data-ba-range>
        <span class="t-ba__handle" aria-hidden="true"><i></i></span>
      </div>
    </div>
  </section>`;
}

// Engagements: one long wet trail crossing the screen sideways (pinned on desktop);
// each engagement de-fogs when the trail reaches its droplet.
function trailPath(n) {
  const pts = Array.from({ length: n }, (_, i) => [((i + 0.5) / n) * 1000, i % 2 ? 560 : 440]);
  let d = `M0 500`;
  let prev = [0, 500];
  for (const p of [...pts, [1000, 500]]) {
    const dx = (p[0] - prev[0]) / 2;
    d += ` C${(prev[0] + dx).toFixed(1)} ${prev[1]} ${(p[0] - dx).toFixed(1)} ${p[1]} ${p[0].toFixed(1)} ${p[1]}`;
    prev = p;
  }
  return d;
}

function values(ctx, m) {
  const d = trailPath(m.values.length);
  return html`<section class="t-section t-vals" aria-labelledby="v-title" data-vals>
    <div class="t-vals__pin" data-vals-pin>
      <div class="t-vals__track" data-vals-track>
        <div class="t-vals__intro">
          ${eyebrow(7, 'Engagements')}
          <h2 id="v-title" class="t-h2" data-dry>Sept engagements.</h2>
          <p class="t-lead" data-fog>${fr(ctx.data.brand.mission)}</p>
          <p class="t-mono t-vals__hint" aria-hidden="true"><i></i>La trace avance avec le défilement</p>
        </div>
        <div class="t-vals__rail" style="--n:${m.values.length}" data-vals-rail>
          <svg class="t-vals__svg t-vals__svg--dry" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>
          <svg class="t-vals__svg t-vals__svg--wet" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" data-vals-wet>
            <defs><linearGradient id="t-wet-g" x1="0" x2="1000" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e9f5f7"/><stop offset="0.5" stop-color="#3fb6c2"/><stop offset="1" stop-color="#9fdde3"/></linearGradient></defs>
            <path class="t-vals__glow" d="${d}"/><path class="t-vals__line" d="${d}"/>
          </svg>
          <ol class="t-vals__list">${m.values.map((v, i) => html`<li class="t-val t-val--${i % 2 ? 'down' : 'up'}" data-val>
            <span class="t-val__drop" aria-hidden="true"></span>
            <div class="t-val__card"><span class="t-mono t-val__n">${pad(i + 1)} / ${pad(m.values.length)}</span><h3 class="t-val__t">${v.title}</h3><p>${fr(v.text)}</p></div>
          </li>`)}</ol>
        </div>
      </div>
    </div>
  </section>`;
}

// Guide pierre: seven passes over the same marble floor, from matte to mirror.
// While pinned, scrolling advances the squeegee edge and the current step.
function stone(ctx, m) {
  const machines = ctx.data.site.stoneMachines.map((s) => ctx.data.products.find((p) => p.slug === s)).filter(Boolean);
  const n = m.steps.length;
  return html`${wetTrail()}<section class="t-section t-stone" aria-labelledby="st-title" data-stone>
    <div class="t-stone__pin" data-stone-pin>
      <div class="t-wrap t-stone__grid">
        <div class="t-stone__side">
          ${eyebrow(8, 'Ressource')}
          <h2 id="st-title" class="t-h3" data-dry>Rénover un sol en pierre, en ${n} passages.</h2>
          <ol class="t-stone__list" data-stone-list>${m.steps.map((s, i) => html`<li class="t-stone__step${i === 0 ? ' is-active' : ''}" data-stone-step>
            <span class="t-stone__n">${pad(s.n)}</span>
            <div><h3 class="t-stone__t">${s.title}</h3><p>${fr(s.text)}</p></div>
          </li>`)}</ol>
          <div class="t-stone__rail" aria-hidden="true">${m.steps.map((s, i) => html`<i class="${i === 0 ? 'is-on' : ''}" data-stone-tick><span>${pad(s.n)}</span></i>`)}</div>
          <a class="t-link" href="${ctx.link('guides/renover-sol-pierre.html')}">Lire le guide complet</a>
        </div>
        <div class="t-stone__visual">
          <div class="t-stone__floor" data-stone-floor data-sheen>
            ${genImg(ctx, 'tex-marbre-sale', 'Sol en marbre voilé avant rénovation (illustration)', 't-stone__img')}
            <div class="t-stone__clean">${genImg(ctx, 'tex-marbre-propre', 'Le même sol en marbre poli après rénovation (illustration)', 't-stone__img')}</div>
            <span class="t-stone__blade" aria-hidden="true"></span>
            <span class="t-mono t-stone__tag t-stone__tag--l">Poli miroir</span><span class="t-mono t-stone__tag t-stone__tag--r">Sol voilé</span>
          </div>
          ${machines.length ? html`<div class="t-stone__machines"><p class="t-mono">Machines associées</p><ul>${machines.map((p) => html`<li><a href="${ctx.link(`produits/${p.slug}.html`)}">${productImg(ctx, p.img, '')}<span>${p.name}</span></a></li>`)}</ul></div>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

export function renderHome(ctx) {
  const m = homeModel(ctx.data);
  return layout(ctx, html`${hero(ctx, m)}${passes(ctx, m)}${widths(ctx)}${robot(ctx, m)}${guide(ctx)}${sectors(ctx, m)}${beforeAfter(ctx)}${values(ctx, m)}${stone(ctx, m)}${cta(ctx)}`, { data: true, overlay: true });
}
