// Rondeur — Accueil.
import { html } from '../../../lib/html.mjs';
import { homeModel } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { kicker, button, orbitCta, icon, porthole, productImg, genImg, scallop, cta } from '../components.mjs';
import { heroPicture } from '../../../lib/media.mjs';

const pad = (n) => String(n).padStart(2, '0');

// Hero « l'éclipse » : texte à gauche, système orbital à droite (planète-image, lune-produit, chiffres en orbite).
function hero(ctx, m) {
  const pg = ctx.data.pages.home;
  const g9 = ctx.data.products.find((p) => p.slug === 'g9');
  const figs = [
    ['productivity', 'm²/h', 'Rendement théorique', -50],
    ['width', 'mm', 'Largeur de travail', 12],
    ['tank', 'L', 'Réservoir', 98],
    ['autonomy', 'h', 'Autonomie', 156],
  ].filter(([k]) => typeof g9.key[k] === 'number');
  return html`<section class="r-hero" aria-labelledby="h1" data-hero>
    <span class="r-hero__halo" aria-hidden="true"><i></i><i></i><i></i></span>
    <div class="r-wrap r-hero__grid">
      <div class="r-hero__text" data-depth="-6">
        <p class="r-hero__meta" data-hi><span class="r-hero__metadot" aria-hidden="true"></span>Catalogue 2024 · ${m.totals.products} machines · ${m.totals.gammes} gammes</p>
        <h1 id="h1" class="r-display r-hero__title" data-hero-title>${pg.h1}</h1>
        <p class="r-lead r-hero__lead" data-hi>${fr(pg.intro)}</p>
        <div class="r-hero__actions" data-hi>${orbitCta(ctx.link('contact.html'))}${button(ctx.link('catalogue.html'), 'Explorer le catalogue', { variant: 'line' })}</div>
      </div>
      <div class="r-hero__system" data-hero-system>
        <svg class="r-hero__rings" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="99" pathLength="1" data-hero-ring/>
          <circle cx="100" cy="100" r="86" pathLength="1" class="is-dash" data-hero-ring/>
        </svg>
        <span class="r-hero__sat" aria-hidden="true"><i data-hpop></i></span>
        <div class="r-hero__planet" data-hero-planet data-depth="8">
          <div class="r-hero__bg" data-spin-slow><span class="r-hero__zoom" data-hero-zoom>${heroPicture(ctx, 'rondeur', 'Sol en terrazzo poli vu du dessus, cercles de polissage')}</span></div>
        </div>
        <span class="r-hero__brush" aria-hidden="true" data-hpop data-depth="22"><span data-spin>${genImg(ctx, 'obj-disque-brosse', '', '', true)}</span></span>
        <span class="r-hero__drop" aria-hidden="true" data-hpop data-depth="30">${genImg(ctx, 'obj-goutte', '', '', true)}</span>
        <a class="r-hero__moon" href="${ctx.link('produits/g9.html')}" data-hpop data-depth="16" data-tilt aria-label="Voir la fiche GRILLOO G9">
          <span class="r-hero__moondisc">${productImg(ctx, g9.img, 'Autolaveuse autoportée GRILLOO G9', 'r-hero__moonimg', true)}</span>
          <span class="r-hero__moonlbl"><b>G9</b> Autolaveuse autoportée</span>
        </a>
        <ul class="r-hero__figs" aria-label="Chiffres clés GRILLOO G9">
          ${figs.map(([k, u, l, a]) => html`<li class="r-hero__fig" style="--a:${a}deg"><span data-hpop><b>${fmt(g9.key[k])}<small>${u}</small></b><em>${l}</em></span></li>`)}
        </ul>
      </div>
    </div>
    <a class="r-hero__scroll" href="#gammes" data-hi><span class="r-hero__mouse" aria-hidden="true"><i></i></span>Défiler</a>
  </section>`;
}

function carousel(ctx, m) {
  return html`<section class="r-section r-orbit" id="gammes" aria-labelledby="orbit-title">
    <div class="r-wrap r-center">${kicker(1, 'Six gammes')}<h2 id="orbit-title" class="r-h2" data-rise>Faites tourner la gamme.</h2></div>
    <div class="r-carousel" data-carousel aria-roledescription="carrousel" aria-label="Gammes GRILLOO">
      <div class="r-carousel__ring" data-carousel-ring>
        ${m.gammes.map((g, i) => html`<button class="r-carousel__thumb" type="button" style="--i:${i}" data-carousel-go="${i}" aria-label="${g.g.name}" aria-pressed="${i === 0 ? 'true' : 'false'}"><span>${productImg(ctx, g.samples[2]?.img || g.samples[0].img, '')}</span></button>`)}
      </div>
      <div class="r-carousel__stage">
        ${m.gammes.map((g, i) => {
          const r = g.ranges.productivity || g.ranges.tank || g.ranges.power;
          const unit = g.ranges.productivity ? 'm²/h' : g.ranges.tank ? 'L' : 'W';
          return html`<div class="r-carousel__panel" data-carousel-panel="${i}" role="group" aria-roledescription="diapositive" aria-label="${i + 1} sur ${m.gammes.length}">
            <span class="r-carousel__idx">${pad(i + 1)} / ${pad(m.gammes.length)}</span>
            <h3 class="r-carousel__name">${g.g.name}</h3>
            <p class="r-carousel__meta">${g.count} modèles${r ? html` · ${fmt(r.min)} – ${fmt(r.max)} ${unit}` : ''}</p>
            <a class="r-link" href="${ctx.link(g.file)}">Voir la gamme</a>
          </div>`;
        })}
      </div>

    </div>
    <div class="r-carousel__nav">
        <button class="r-round" type="button" data-carousel-prev aria-label="Gamme précédente">${icon('arrow', 'r-ico r-ico--flip')}</button>
        <button class="r-round" type="button" data-carousel-next aria-label="Gamme suivante">${icon('arrow')}</button>
      </div>
  </section>`;
}

function robot(ctx, m) {
  const r = m.robot;
  const figs = r.figures.filter((f) => ['productivity', 'width', 'tank', 'autonomy'].includes(f.key));
  return html`<section class="r-section r-robot" aria-labelledby="robot-title">
    ${scallop()}
    <div class="r-wrap r-robot__grid">
      <div data-pop data-tilt>${porthole(ctx, r.p.img, 'Autolaveuse autonome GRILLOO RoboClean G+', figs, { size: 'r-hub--xl' })}</div>
      <div class="r-robot__text">
        ${kicker(2, 'Autonome et manuelle')}
        <h2 id="robot-title" class="r-h2" data-rise>RoboClean G+</h2>
        <p class="r-lead" data-pop>${fr(r.lead)}</p>
        <ul class="r-dots" data-pop>${r.sections.map((s) => html`<li>${s.title}</li>`)}</ul>
        <div data-pop>${button(ctx.link('robotclean-g-plus.html'), 'Découvrir RoboClean G+')}</div>
      </div>
    </div>
  </section>`;
}

function guide(ctx) {
  return html`<section class="r-section r-teaser" aria-labelledby="g-title">
    <div class="r-wrap r-center">
      ${kicker(3, 'Guide de choix')}
      <h2 id="g-title" class="r-h2" data-rise>Combien de m² à l’heure ?</h2>
      <form class="r-dial" data-teaser action="${ctx.link('guide-de-choix.html')}" method="get" data-pop>
        <input type="hidden" name="surfaceType" value="dur"><input type="hidden" name="hours" value="1">
        <div class="r-dial__face">
          <svg class="r-dial__arc" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="92" class="r-dial__track"/><circle cx="100" cy="100" r="92" class="r-dial__val" data-dial-arc/></svg>
          <label class="r-dial__center"><span class="sr">Surface de sol dur en m² par heure</span><input name="area" type="number" min="100" step="100" value="2500" inputmode="numeric"><small>m² / heure</small></label>
        </div>
        <p class="r-dial__out"><b data-teaser-count>—</b> machines du catalogue atteignent <b data-teaser-needed>2 500</b> m²/h</p>
        <button class="r-btn r-btn--ink" type="submit" data-magnetic><span class="r-btn__txt">Voir les machines</span><span class="r-btn__ico">${icon('arrow')}</span></button>
      </form>
    </div>
  </section>`;
}

// 05 — Secteurs : « l'orbite des lieux ». Six hublots posés sur un grand arc ; le défilement fait tourner l'arc
// et amène chaque lieu au sommet. Sans animation : rangée de hublots à faire défiler.
function sectors(ctx, m) {
  return html`<section class="r-orb" aria-labelledby="s-title" data-orb>
    <div class="r-orb__pin" data-orb-pin>
      <div class="r-wrap r-orb__head">
        <div>${kicker(4, 'Secteurs')}<h2 id="s-title" class="r-h2" data-rise>Six environnements.</h2></div>
        <p class="r-orb__hint" data-pop><span class="r-orb__hintdot" aria-hidden="true"></span><span class="r-orb__hint--orbit">Chaque lieu vient au sommet de l’orbite : faites défiler ou choisissez un hublot.</span><span class="r-orb__hint--row">Faites glisser la rangée pour parcourir les six lieux.</span></p>
      </div>
      <div class="r-orb__stage" data-orb-stage>
        <svg class="r-orb__ring" viewBox="0 0 100 100" aria-hidden="true" data-orb-ring><circle cx="50" cy="50" r="49.8"/></svg>
        <span class="r-orb__apex" aria-hidden="true"></span>
        <ol class="r-orb__list">
          ${m.sectors.map((s, i) => html`<li class="r-orb__item${i === 0 ? ' is-active' : ''}" data-orb-item="${i}">
            <a class="r-orb__port" href="${ctx.link('secteurs.html')}#${s.slug}" tabindex="-1" aria-hidden="true" data-orb-port>
              <span class="r-orb__disc">${genImg(ctx, s.img, '', 'r-orb__img')}</span>
              <span class="r-orb__n">${pad(i + 1)}</span>
            </a>
            <div class="r-orb__info">
              <p class="r-orb__count"><b>${s.count}</b> machines associées</p>
              <h3 class="r-orb__name">${s.name}</h3>
              <p class="r-orb__intro">${fr(s.intro)}</p>
              <a class="r-link" href="${ctx.link('secteurs.html')}#${s.slug}">Voir les machines<span class="sr"> : ${s.name}</span></a>
            </div>
          </li>`)}
        </ol>
        <p class="r-orb__pager" aria-hidden="true"><b data-orb-cur>01</b> / ${pad(m.sectors.length)}</p>
      </div>
    </div>
  </section>`;
}

// 06 — Engagements : « le fil ». Une trajectoire en S se trace au défilement ; une bille cyan la parcourt
// et allume chaque engagement au passage.
function values(ctx, m) {
  return html`<section class="r-section r-thread" aria-labelledby="v-title" data-thread>
    <div class="r-wrap r-thread__head">
      <div>${kicker(5, 'Engagements')}<h2 id="v-title" class="r-h2" data-rise>Sept engagements.</h2></div>
      <p class="r-lead" data-pop>${fr(ctx.data.brand.mission)}</p>
    </div>
    <div class="r-wrap">
      <div class="r-thread__track" data-thread-track>
        <svg class="r-thread__svg" aria-hidden="true" data-thread-svg><path class="r-thread__base" data-thread-base d=""/><path class="r-thread__line" data-thread-line d=""/></svg>
        <span class="r-thread__bead" aria-hidden="true" data-thread-bead></span>
        <ol class="r-thread__list">
          ${m.values.map((v, i) => html`<li class="r-thread__node r-thread__node--${i % 2 ? 'r' : 'l'}" data-thread-node>
            <span class="r-thread__dot" data-thread-dot><span>${pad(i + 1)}</span></span>
            <div class="r-thread__txt" data-pop><h3>${v.title}</h3><p>${fr(v.text)}</p></div>
          </li>`)}
        </ol>
      </div>
    </div>
  </section>`;
}

// 07 — Guide pierre : « la piste de polissage ». Un plateau roule sur une bande de marbre voilé et le fait
// briller derrière lui ; les 7 étapes s'allument à son passage.
function stone(ctx, m) {
  return html`<section class="r-section r-polish" aria-labelledby="st-title" data-polish>
    <div class="r-wrap r-polish__head">
      <div>${kicker(6, 'Ressource')}<h2 id="st-title" class="r-h2" data-rise>Rénover un sol en pierre, en 7 étapes.</h2></div>
      <div class="r-polish__aside" data-pop>
        <p class="r-lead">Du meulage initial à la crème de polissage : la méthode décrite dans le catalogue, et les machines associées.</p>
        ${button(ctx.link('guides/renover-sol-pierre.html'), 'Lire le guide', { variant: 'line' })}
      </div>
    </div>
    <div class="r-wrap r-polish__track" data-polish-track>
      <figure class="r-polish__band" data-polish-band>
        ${genImg(ctx, 'tex-marbre-propre', 'Sol en marbre poli (illustration)', 'r-polish__img')}
        <span class="r-polish__dull" aria-hidden="true" data-polish-dull>${genImg(ctx, 'tex-marbre-sale', '', 'r-polish__img')}</span>
        <span class="r-polish__clip" aria-hidden="true"><span class="r-polish__shine" data-polish-shine></span></span>
        <span class="r-polish__pad" aria-hidden="true" data-polish-pad><span data-polish-spin>${genImg(ctx, 'obj-pad', '', '')}</span></span>
        <figcaption class="r-polish__cap">Illustration</figcaption>
      </figure>
      <ol class="r-polish__steps">
        ${m.steps.map((s) => html`<li class="r-polish__step" data-polish-step>
          <span class="r-polish__n">${s.n}</span>
          <h3>${s.title}</h3>
          <p>${fr(s.text)}</p>
        </li>`)}
      </ol>
    </div>
  </section>`;
}

export function renderHome(ctx) {
  const m = homeModel(ctx.data);
  return layout(ctx, html`${hero(ctx, m)}${carousel(ctx, m)}${robot(ctx, m)}${guide(ctx)}${sectors(ctx, m)}${values(ctx, m)}${stone(ctx, m)}${cta(ctx)}`, { data: true });
}
