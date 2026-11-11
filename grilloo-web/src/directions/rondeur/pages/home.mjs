// Rondeur — Accueil.
import { html } from '../../../lib/html.mjs';
import { homeModel } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { kicker, button, orbitCta, icon, porthole, productImg, genImg, scallop, circleChain, cta, cluster } from '../components.mjs';
import { heroPicture } from '../../../lib/media.mjs';

const pad = (n) => String(n).padStart(2, '0');

function hero(ctx, m) {
  const pg = ctx.data.pages.home;
  const g9 = ctx.data.products.find((p) => p.slug === 'g9');
  return html`<section class="r-hero" aria-labelledby="h1">
    <div class="r-hero__stage">
      <div class="r-hero__bg" data-spin-slow>${heroPicture(ctx, 'rondeur', 'Sol en terrazzo poli vu du dessus, cercles de polissage')}</div>
      <span class="r-hero__rings" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="r-hero__brush" aria-hidden="true" data-spin>${genImg(ctx, 'obj-disque-brosse', '', '', true)}</span>
      <span class="r-hero__foam" aria-hidden="true" data-float="12">${genImg(ctx, 'obj-ecume', '', '', true)}</span>
      <span class="r-hero__drop" aria-hidden="true" data-float="8">${genImg(ctx, 'obj-goutte', '', '', true)}</span>
      <a class="r-hero__port" href="${ctx.link('produits/g9.html')}" data-float="10" aria-label="Voir la fiche GRILLOO G9">
        <span class="r-hero__portdisc">${productImg(ctx, g9.img, '', 'r-hero__portimg', true)}</span>
        <span class="r-hero__portlbl"><b>G9</b> ${fmt(g9.key.productivity)} m²/h</span>
      </a>
      <div class="r-wrap r-hero__in">
        <p class="r-hero__meta" data-pop>Catalogue 2024 · ${m.totals.products} machines · ${m.totals.gammes} gammes</p>
        <h1 id="h1" class="r-display" data-rise>${pg.h1}</h1>
        <div class="r-hero__actions" data-pop>${orbitCta(ctx.link('contact.html'))}${button(ctx.link('catalogue.html'), 'Explorer le catalogue', { variant: 'line' })}</div>
      </div>
    </div>
    <div class="r-wrap r-hero__below"><p class="r-lead" data-pop>${fr(pg.intro)}</p></div>
  </section>`;
}

function carousel(ctx, m) {
  return html`<section class="r-section r-orbit" aria-labelledby="orbit-title">
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
      <div data-pop>${porthole(ctx, r.p.img, 'Autolaveuse autonome GRILLOO RoboClean G+', figs, { size: 'r-hub--xl' })}</div>
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

function sectors(ctx, m) {
  return html`<section class="r-section r-sectors" aria-labelledby="s-title">
    <div class="r-wrap r-center">${kicker(4, 'Secteurs')}<h2 id="s-title" class="r-h2" data-rise>Six environnements.</h2></div>
    <div class="r-wrap r-sectors__grid">
      ${m.sectors.map((s) => html`<a class="r-sector" href="${ctx.link('secteurs.html')}#${s.slug}" data-pop>
        <span class="r-sector__disc" data-float="6">${genImg(ctx, s.img, '', 'r-sector__img')}</span>
        <span class="r-sector__name">${s.name}</span><span class="r-sector__n">${s.count} machines</span>
      </a>`)}
    </div>
  </section>`;
}

function values(ctx, m) {
  return html`<section class="r-section r-values" aria-labelledby="v-title">
    ${circleChain()}
    <div class="r-wrap r-center">${kicker(5, 'Engagements')}<h2 id="v-title" class="r-h2" data-rise>Sept engagements.</h2><p class="r-lead" data-pop>${fr(ctx.data.brand.mission)}</p></div>
    <ol class="r-wrap r-pastilles">${m.values.map((v, i) => html`<li class="r-pastille" data-pop><span class="r-pastille__n">${pad(i + 1)}</span><h3>${v.title}</h3><p>${fr(v.text)}</p></li>`)}</ol>
  </section>`;
}

function stone(ctx, m) {
  return html`<section class="r-section r-stone" aria-labelledby="st-title">
    <div class="r-wrap r-center">${kicker(6, 'Ressource')}<h2 id="st-title" class="r-h3" data-rise>Rénover un sol en pierre en 7 étapes</h2></div>
    <ol class="r-wrap r-steps7" data-pop>${m.steps.map((s) => html`<li><span>${s.n}</span>${s.title}</li>`)}</ol>
    <div class="r-center" data-pop><a class="r-link" href="${ctx.link('guides/renover-sol-pierre.html')}">Lire le guide</a></div>
  </section>`;
}

export function renderHome(ctx) {
  const m = homeModel(ctx.data);
  return layout(ctx, html`${hero(ctx, m)}${carousel(ctx, m)}${robot(ctx, m)}${guide(ctx)}${sectors(ctx, m)}${values(ctx, m)}${stone(ctx, m)}${cta(ctx)}`, { data: true });
}
