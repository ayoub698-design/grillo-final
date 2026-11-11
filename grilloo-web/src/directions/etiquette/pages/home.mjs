// Étiquette — Accueil.
import { html } from '../../../lib/html.mjs';
import { homeModel } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { cartel, button, figure, productImg, genImg, tag, ctaCoupon, marquee } from '../components.mjs';
import { icon } from '../icons.mjs';

const pad = (n) => String(n).padStart(2, '0');

// Hero « cartel monumental » : a printed sheet on the left (visible 12-column hairlines, display title),
// the gallery panel on the right with the G9 on its plinth, dimension callouts and a museum label (cartel).
// Every figure comes from catalog.json. Entrance choreography: main.js → heroIntro().
function hero(ctx, m) {
  const g9 = ctx.data.products.find((p) => p.slug === 'g9');
  const pg = ctx.data.pages.home;
  const specs = [
    { label: 'Réservoir de solution', value: fmt(g9.key.tank), unit: 'L' },
    { label: 'Autonomie', value: fmt(g9.key.autonomy), unit: 'h' },
  ].filter((f) => f.value);
  return html`<section class="e-hx" aria-labelledby="h1" data-hx>
    <span class="e-hx__cols" aria-hidden="true" data-hx-cols></span>
    <div class="e-hx__panel" data-hx-panel>
      <div class="e-hx__scroll" data-hx-scroll>
        <div class="e-hx__zoom" data-hx-zoom><div class="e-hx__ptr" data-hx-ptr="-8">${genImg(ctx, 'hero-etiquette-s', '', 'e-hx__photo', true)}</div></div>
        <span class="e-hx__beam" aria-hidden="true"></span>
        <div class="e-hx__plane">
          <figure class="e-hx__product">
            <div class="e-hx__rise" data-hx-product>
              <div class="e-hx__ptr" data-hx-ptr="12">
                <span class="e-hx__shadow" aria-hidden="true"></span>
                ${productImg(ctx, g9.img, 'Autolaveuse autoportée GRILLOO G9', 'e-hx__img', true)}
              </div>
            </div>
            <div class="e-callout e-hx__callout" data-callout><svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 1 L62 1 L98 39"/></svg><p><span class="e-label">Rendement théorique</span><b>${fmt(g9.key.productivity)}<small>m²/h</small></b></p></div>
            <div class="e-hx__dim" data-hx-dim><span class="e-hx__dimline"></span><p><span class="e-label">Largeur de travail</span> <b>${fmt(g9.key.width)}<small>mm</small></b></p></div>
          </figure>
        </div>
      </div>
      <span class="e-hx__marks" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="e-hx__ill" aria-hidden="true">Illustration</span>
    </div>
    <div class="e-wrap e-hx__head">
      <div class="e-hx__meta">
        <span class="e-tag" data-hx-print>Catalogue 2024</span>
        <span class="e-hx__rule" data-hx-rule></span>
        <span class="e-label" data-hx-print>${m.totals.products} machines · ${m.totals.gammes} gammes</span>
      </div>
      <h1 id="h1" class="e-hx__title" data-hx-title>${pg.h1}</h1>
    </div>
    <a class="e-hx__cartel" href="${ctx.link('produits/g9.html')}" data-hx-cartel>
      <span class="e-hx__ctop"><span class="e-caption__fig">Fig. 01</span><span class="e-hx__cnotch" aria-hidden="true"></span><span class="e-label">${g9.kind}</span></span>
      <span class="e-hx__cname"><span class="e-card__brand">GRILLOO</span> ${g9.name}</span>
      <span class="e-hx__specs">${specs.map((f) => html`<span class="e-hx__spec"><span class="e-label">${f.label}</span><b>${f.value}<small>${f.unit}</small></b></span>`)}</span>
      <span class="e-hx__cgo">Fiche technique ${icon('arrow', 'e-link__ico')}</span>
    </a>
    <div class="e-wrap e-hx__pitch">
      <p class="e-lead" data-hx-in>${fr(pg.intro)}</p>
      <div class="e-hx__actions" data-hx-in>
        ${button(ctx.link('catalogue.html'), 'Explorer le catalogue')}
        ${button(ctx.link('contact.html'), 'Demander un devis', { variant: 'line' })}
      </div>
      <p class="e-hx__scrollcue" aria-hidden="true" data-hx-in><span></span>Défiler</p>
    </div>
  </section>
  ${marquee(ctx.data.products.map((p) => p.name))}`;
}

function gammesIndex(ctx, m) {
  return html`<section class="e-section e-gammes" id="gammes" aria-labelledby="gammes-title">
    <div class="e-wrap">
      ${cartel(1, 'Gammes')}
      <h2 id="gammes-title" class="e-h2" data-split>Six gammes, ${m.totals.products} machines.</h2>
      <div class="e-gammes__grid">
        <ol class="e-gammes__index" data-index aria-hidden="true">
          ${m.gammes.map((g, i) => html`<li data-index-item="${i}"><span>${pad(i + 1)}</span>${g.g.name}</li>`)}
          <span class="e-gammes__marker" data-index-marker></span>
        </ol>
        <div class="e-gammes__rows">
          ${m.gammes.map((g, i) => {
            const r = g.ranges.productivity || g.ranges.tank || g.ranges.power;
            const unit = g.ranges.productivity ? 'm²/h' : g.ranges.tank ? 'L' : 'W';
            return html`<a class="e-grow" href="${ctx.link(g.file)}" data-index-row="${i}">
              <div class="e-grow__head">
                <span class="e-grow__idx">${pad(i + 1)}</span>
                <h3 class="e-grow__name">${g.g.name}</h3>
                <span class="e-tag e-tag--line">${g.count} modèles</span>
              </div>
              <div class="e-grow__body">
                ${r ? html`<p class="e-grow__range"><span>${fmt(r.min)}</span><i aria-hidden="true"></i><span>${fmt(r.max)}</span><small>${unit}</small></p>` : html`<p class="e-grow__range e-grow__range--text">${g.g.label}</p>`}
                <p class="e-grow__intro">${fr(g.g.intro[0] || '').split('. ')[0]}.</p>
              </div>
              <div class="e-grow__thumbs">${g.samples.map((p) => html`<span class="e-grow__plinth"><span class="e-grow__fl" data-float="5">${productImg(ctx, p.img, `GRILLOO ${p.name}`)}</span><span class="e-label">${p.name}</span></span>`)}</div>
              <span class="e-grow__go">${icon('arrow')}</span>
            </a>`;
          })}
        </div>
      </div>
    </div>
  </section>`;
}

function robot(ctx, m) {
  const r = m.robot;
  const figs = r.figures.filter((f) => ['productivity', 'width', 'tank', 'autonomy'].includes(f.key));
  return html`<section class="e-section e-sheet e-robot" aria-labelledby="robot-title">
    <div class="e-sheet__tab"><span>02</span> Innovation</div>
    <div class="e-wrap e-robot__grid">
      <div class="e-robot__text">
        ${tag('Autolaveuse autonome')}
        <h2 id="robot-title" class="e-h2" data-split>RoboClean G+</h2>
        <p class="e-lead" data-reveal>${fr(r.lead)}</p>
        <ul class="e-robot__points" data-reveal>${r.sections.map((s) => html`<li><span class="e-tri" aria-hidden="true"></span>${s.title}</li>`)}</ul>
        <div class="e-robot__actions" data-reveal>
          ${button(ctx.link('robotclean-g-plus.html'), 'Découvrir RoboClean G+')}
          ${button(ctx.link('contact.html?machine=roboclean-g-plus'), 'Demander une présentation', { variant: 'line' })}
        </div>
      </div>
      <div class="e-robot__visual">
        <span class="e-robot__fl" data-float="10">${productImg(ctx, r.p.img, 'Autolaveuse autonome GRILLOO RoboClean G+', 'e-robot__img')}</span>
        <div class="e-robot__figs">${figs.map((f) => figure({ ...f, label: f.key === 'productivity' ? 'Rendement max. en mode autonome' : f.key === 'tank' ? 'Réservoir eau propre / sale' : f.label }))}</div>
      </div>
    </div>
  </section>`;
}

function guideTeaser(ctx) {
  return html`<section class="e-section e-teaser" aria-labelledby="guide-title">
    <div class="e-wrap">
      ${cartel(3, 'Guide de choix')}
      <h2 id="guide-title" class="e-h2" data-split>Quelle machine pour votre surface ?</h2>
      <form class="e-sentence" data-teaser action="${ctx.link('guide-de-choix.html')}" method="get" data-reveal>
        <p>Je dois nettoyer
          <label class="e-sentence__field"><span class="sr">Surface en m²</span><input name="area" type="number" min="1" step="50" value="2500" inputmode="numeric"><span>m²</span></label>
          de
          <label class="e-sentence__field"><span class="sr">Type de surface</span><select name="surfaceType"><option value="dur">sol dur</option><option value="textile">moquette</option><option value="exterieur">surface extérieure</option><option value="escalator">escalator</option></select></label>
          en
          <label class="e-sentence__field"><span class="sr">Heures disponibles</span><input name="hours" type="number" min="0.5" step="0.5" value="1" inputmode="decimal"><span>h</span></label>.
        </p>
        <div class="e-sentence__out">
          <p><span class="e-label">Rendement nécessaire</span><b data-teaser-needed>2 500</b><small>m²/h</small></p>
          <p><span class="e-label">Machines du catalogue</span><b data-teaser-count>—</b></p>
          <button class="e-btn e-btn--ink" type="submit"><span class="e-btn__txt">Voir les machines</span>${icon('arrow', 'e-btn__ico')}</button>
        </div>
      </form>
    </div>
  </section>`;
}

// 05 · Secteurs — « index des lieux » : list of places; the sticky plate on the left shows the active one
// (hover, focus or scroll position). On small screens each row carries its own picture.
function sectors(ctx, m) {
  return html`<section class="e-section e-sx" aria-labelledby="sectors-title" data-sx>
    <div class="e-wrap">
      ${cartel(4, 'Secteurs', `${pad(m.sectors.length)} environnements`)}
      <div class="e-sx__grid">
        <div class="e-sx__stage" aria-hidden="true">
          <div class="e-sx__frame" data-mask="up">
            ${m.sectors.map((s, i) => html`<span class="e-sx__shot${i === 0 ? ' is-active' : ''}" data-sx-shot="${i}">${genImg(ctx, s.img, '', 'e-sx__img')}</span>`)}
            <span class="e-sx__crop"><i></i><i></i><i></i><i></i></span>
            <span class="e-sx__ill">Illustration</span>
          </div>
          <div class="e-sx__plates">
            ${m.sectors.map((s, i) => html`<div class="e-sx__plate${i === 0 ? ' is-active' : ''}" data-sx-plate="${i}">
              <span class="e-caption__fig">Fig. ${pad(i + 1)}</span>
              <p class="e-sx__ptext">${fr(s.intro)}</p>
            </div>`)}
          </div>
        </div>
        <div class="e-sx__side">
          <h2 id="sectors-title" class="e-h2" data-split>Une machine pour chaque lieu.</h2>
          <ol class="e-sx__list">
            ${m.sectors.map((s, i) => html`<li data-reveal>
              <a class="e-sx__row${i === 0 ? ' is-active' : ''}" href="${ctx.link('secteurs.html')}#${s.slug}" data-sx-row="${i}">
                <span class="e-sx__thumb" aria-hidden="true">${genImg(ctx, s.img, '', 'e-sx__timg')}</span>
                <span class="e-sx__idx">${pad(i + 1)}</span>
                <span class="e-sx__ico" aria-hidden="true">${icon(s.slug)}</span>
                <span class="e-sx__name">${s.name}</span>
                <span class="e-sx__count"><b>${s.count}</b> machines</span>
                <span class="e-sx__go" aria-hidden="true">${icon('arrow')}</span>
              </a>
            </li>`)}
          </ol>
          <a class="e-link e-sx__all" href="${ctx.link('secteurs.html')}" data-reveal>Tous les secteurs ${icon('arrow', 'e-link__ico')}</a>
        </div>
      </div>
    </div>
  </section>`;
}

// 06 · Engagements — « fiches à onglets » : seven index cards on a track that slides horizontally
// while the section is pinned (desktop, motion allowed); native swipe on touch; plain grid otherwise.
function engagements(ctx, m) {
  const n = m.values.length;
  return html`<section class="e-section e-vx" aria-labelledby="values-title" data-vx>
    <div class="e-vx__pin" data-vx-pin>
      <div class="e-wrap">
        ${cartel(5, 'Engagements', `${pad(n)} principes`)}
        <div class="e-vx__head">
          <h2 id="values-title" class="e-h2" data-split>Sept engagements.</h2>
          <p class="e-lead" data-reveal>${fr(ctx.data.brand.mission)}</p>
        </div>
      </div>
      <div class="e-vx__vp" data-vx-vp>
        <ol class="e-vx__track" data-vx-track>
          ${m.values.map((v, i) => html`<li class="e-vx__card" data-vx-card>
            <span class="e-vx__tab"><b>${pad(i + 1)}</b> / ${pad(n)}</span>
            <span class="e-vx__num" aria-hidden="true">${pad(i + 1)}</span>
            <h3 class="e-vx__title">${v.title}</h3>
            <p class="e-vx__text">${fr(v.text)}</p>
            <span class="e-vx__foot" aria-hidden="true"><span class="e-vx__notch"></span></span>
          </li>`)}
        </ol>
      </div>
      <div class="e-wrap e-vx__bar" aria-hidden="true">
        <span class="e-vx__ticks">${m.values.map((v, i) => html`<i data-vx-tick="${i}">${pad(i + 1)}</i>`)}</span>
        <span class="e-vx__rail"><span class="e-vx__fill" data-vx-fill></span></span>
      </div>
    </div>
  </section>`;
}

// 07 · Guide pierre — « échelle des grains » : a polishing band (veiled → polished marble) and a graduated
// rule; both fill with the scroll and light each of the 7 steps. Grits are read from the step texts.
function stoneTeaser(ctx, m) {
  const grit = (t) => {
    const g = [...String(t).matchAll(/#(\d+)/g)].map((x) => Number(x[1]));
    if (!g.length) return '';
    const lo = Math.min(...g), hi = Math.max(...g);
    return lo === hi ? `#${fmt(lo)}` : `#${fmt(lo)} → #${fmt(hi)}`;
  };
  return html`<section class="e-section e-gx" aria-labelledby="stone-title" data-gx>
    <div class="e-wrap">
      ${cartel(6, 'Ressource', `${pad(m.steps.length)} étapes`)}
      <div class="e-gx__head">
        <h2 id="stone-title" class="e-h2" data-split>Rénover un sol en pierre en 7 étapes</h2>
        <div class="e-gx__intro" data-reveal>
          <p class="e-body">Du meulage initial à la crème de polissage : la méthode décrite dans le catalogue, et les machines associées.</p>
          <a class="e-link" href="${ctx.link('guides/renover-sol-pierre.html')}">Lire le guide ${icon('arrow', 'e-link__ico')}</a>
        </div>
      </div>
      <div class="e-gx__band" data-mask="left" aria-hidden="true">
        ${genImg(ctx, 'tex-marbre-sale', '', 'e-gx__img')}
        <span class="e-gx__tag e-gx__tag--r">Sol voilé</span>
        <span class="e-gx__clean">${genImg(ctx, 'tex-marbre-propre', '', 'e-gx__img')}</span>
        <span class="e-gx__edge"><i></i><span class="e-gx__tag e-gx__tag--l">Sol poli</span></span>
      </div>
      <p class="e-caption"><span class="e-caption__fig">Illustration</span> Marbre voilé puis poli, le long des 7 étapes.</p>
      <div class="e-gx__rule" aria-hidden="true"><span class="e-gx__track"><span class="e-gx__rider"></span></span></div>
      <ol class="e-gx__steps">
        ${m.steps.map((s, i) => html`<li class="e-gx__step${i === 0 ? ' is-on' : ''}" data-gx-step="${i}">
          <span class="e-gx__n">${pad(s.n)}</span>
          <span class="e-gx__grit">${grit(s.text) || html`<span aria-hidden="true">—</span>`}</span>
          <h3 class="e-gx__t">${s.title}</h3>
        </li>`)}
      </ol>
    </div>
  </section>`;
}

export function renderHome(ctx) {
  const m = homeModel(ctx.data);
  return layout(ctx, html`${hero(ctx, m)}${gammesIndex(ctx, m)}${robot(ctx, m)}${guideTeaser(ctx)}${sectors(ctx, m)}${engagements(ctx, m)}${stoneTeaser(ctx, m)}${ctaCoupon(ctx)}`, { data: true });
}
