// Étiquette — Accueil.
import { html, raw } from '../../../lib/html.mjs';
import { homeModel } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { cartel, notchRule, button, figure, productImg, genImg, tag, ctaCoupon, mosaic, marquee } from '../components.mjs';
import { heroPicture } from '../../../lib/media.mjs';
import { icon } from '../icons.mjs';

const pad = (n) => String(n).padStart(2, '0');

function hero(ctx, m) {
  const g9 = ctx.data.products.find((p) => p.slug === 'g9');
  const pg = ctx.data.pages.home;
  return html`<section class="e-hero e-scene" aria-labelledby="h1">
    <div class="e-scene__stage">
      <div class="e-scene__bg" data-kenburns>${heroPicture(ctx, 'etiquette', 'Galerie en marbre blanc baignée de lumière')}</div>
      <span class="e-scene__beam" aria-hidden="true"></span>
      <span class="e-scene__fade" aria-hidden="true"></span>
      <figure class="e-scene__product" data-specimen>
        <span class="e-scene__shadow" aria-hidden="true"></span>
        ${productImg(ctx, g9.img, 'Autolaveuse autoportée GRILLOO G9', 'e-scene__img', true)}
        <div class="e-callout e-callout--a" data-callout><svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M100 1 L62 1 L2 39"/></svg><p><span class="e-label">Rendement théorique</span><b>${fmt(g9.key.productivity)}<small>m²/h</small></b></p></div>
        <div class="e-callout e-callout--b" data-callout><svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M100 1 L62 1 L2 39"/></svg><p><span class="e-label">Réservoir de solution</span><b>${fmt(g9.key.tank)}<small>L</small></b></p></div>
        <figcaption class="e-caption e-scene__cap"><span class="e-caption__fig">Fig. 01</span> GRILLOO G9 · largeur ${fmt(g9.key.width)} mm</figcaption>
      </figure>
      <div class="e-wrap e-scene__title">
        ${cartel(null, 'Catalogue 2024', `${m.totals.products} machines · ${m.totals.gammes} gammes`)}
        <h1 id="h1" class="e-display" data-split>${pg.h1}</h1>
      </div>
    </div>
    <div class="e-wrap e-scene__below">
      <p class="e-lead" data-reveal>${fr(pg.intro)}</p>
      <div class="e-hero__actions" data-reveal>
        ${button(ctx.link('catalogue.html'), 'Explorer le catalogue')}
        ${button(ctx.link('contact.html'), 'Demander un devis', { variant: 'line' })}
      </div>
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

function sectors(ctx, m) {
  return html`<section class="e-section e-sectors" aria-labelledby="sectors-title">
    <div class="e-wrap">
      ${cartel(4, 'Secteurs')}
      <h2 id="sectors-title" class="e-h2" data-split>Une machine pour chaque lieu.</h2>
      <div class="e-sectors__grid">
        ${m.sectors.map((s, i) => html`<a class="e-sector" href="${ctx.link('secteurs.html')}#${s.slug}" data-reveal>
          <span class="e-sector__media" data-mask="up"><span class="e-sector__par" data-parallax="0.08">${genImg(ctx, s.img, '', 'e-sector__img')}</span></span>
          <span class="e-sector__meta"><span class="e-sector__idx">${pad(i + 1)}</span><span class="e-sector__name">${s.name}</span><span class="e-label">${s.count} machines</span></span>
        </a>`)}
      </div>
    </div>
  </section>`;
}

function engagements(ctx, m) {
  return html`<section class="e-section e-values" aria-labelledby="values-title">
    <div class="e-wrap e-values__grid">
      <div class="e-values__head">
        ${cartel(5, 'Engagements')}
        <h2 id="values-title" class="e-h2" data-split>Sept engagements.</h2>
        <p class="e-lead" data-reveal>${fr(ctx.data.brand.mission)}</p>
      </div>
      <ol class="e-values__list">
        ${m.values.map((v, i) => html`<li class="e-value" data-reveal><span class="e-value__idx">${pad(i + 1)}</span><h3 class="e-value__title">${v.title}</h3><p>${fr(v.text)}</p></li>`)}
      </ol>
    </div>
  </section>`;
}

function stoneTeaser(ctx, m) {
  return html`<section class="e-section e-stone" aria-labelledby="stone-title">
    <div class="e-wrap">
      ${notchRule('62%')}
      <div class="e-stone__grid">
        <div>
          ${tag('Ressource')}
          <h2 id="stone-title" class="e-h3 e-stone__title" data-split>Rénover un sol en pierre en 7 étapes</h2>
          <p class="e-body" data-reveal>Du meulage initial à la crème de polissage : la méthode décrite dans le catalogue, et les machines associées.</p>
          <a class="e-link" href="${ctx.link('guides/renover-sol-pierre.html')}" data-reveal>Lire le guide ${icon('arrow', 'e-link__ico')}</a>
        </div>
        <ol class="e-scale" data-scale>
          ${m.steps.map((s) => html`<li><span class="e-scale__n">${pad(s.n)}</span><span class="e-scale__t">${s.title}</span></li>`)}
        </ol>
      </div>
    </div>
  </section>`;
}

export function renderHome(ctx) {
  const m = homeModel(ctx.data);
  return layout(ctx, html`${hero(ctx, m)}${gammesIndex(ctx, m)}${robot(ctx, m)}${guideTeaser(ctx)}${sectors(ctx, m)}${engagements(ctx, m)}${stoneTeaser(ctx, m)}${ctaCoupon(ctx)}`, { data: true });
}
