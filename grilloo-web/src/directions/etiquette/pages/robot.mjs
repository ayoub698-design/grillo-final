// Étiquette — RoboClean G+ (page vitrine).
import { html } from '../../../lib/html.mjs';
import { robotModel } from '../../../lib/view-models.mjs';
import { fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { breadcrumbs, cartel, tag, button, figure, productImg, genImg, specTable, ctaCoupon, mosaic } from '../components.mjs';
import { ROBOT_SET } from '../../../lib/media.mjs';

export function renderRobot(ctx) {
  const m = robotModel(ctx.data);
  const imgs = ['amb-mall', 'amb-clinique', 'amb-gare'];
  const body = html`
  <section class="e-pp e-rb" aria-labelledby="h1">
    <div class="e-wrap">
      ${breadcrumbs(ctx)}
      <div class="e-rb__grid">
        <div class="e-rb__text">
          <div class="e-pp__tags">${tag('Autolaveuse autonome')}${tag('Lithium-ion', 'e-tag--line')}</div>
          <h1 id="h1" class="e-display" data-split>RoboClean G+</h1>
          <p class="e-lead" data-reveal>${fr(ctx.data.pages.robot.intro)} ${fr(m.lead)}</p>
          <p class="e-body" data-reveal>${fr(m.intro)}</p>
          <div class="e-pp__actions" data-reveal>
            ${button(ctx.link('contact.html?machine=roboclean-g-plus'), 'Demander une présentation')}
            ${button('#caracteristiques', 'Caractéristiques', { variant: 'line', iconName: 'arrow-down' })}
          </div>
        </div>
        <figure class="e-rb__visual">
          <div class="e-pp__plinth e-rb__plinth">${productImg(ctx, m.p.img, 'Autolaveuse autonome GRILLOO RoboClean G+', 'e-pp__img', true)}</div>
          <figcaption class="e-caption"><span class="e-caption__fig">Fig. 01</span> GRILLOO RoboClean G+ — mode autonome et mode manuel</figcaption>
        </figure>
      </div>
      <div class="e-rb__figs" data-reveal>${m.figures.map((f) => figure({ ...f, label: f.key === 'productivity' ? 'Max. en mode autonome' : f.key === 'tank' ? 'Eau propre / sale' : f.key === 'power' ? 'Puissance absorbée' : f.label }))}</div>
    </div>
  </section>

  ${m.sections.map((s, i) => html`<section class="e-section e-rb__sec${i % 2 ? ' e-rb__sec--rev' : ''}" aria-labelledby="rb-${i}">
    <div class="e-wrap e-rb__secgrid">
      <div class="e-rb__sectext">
        ${cartel(i + 1, ['Accessibilité', 'Sécurité', 'Décisions'][i])}
        <h2 id="rb-${i}" class="e-h2" data-split>${s.title}</h2>
        ${s.paragraphs.map((t) => html`<p class="e-body" data-reveal>${fr(t)}</p>`)}
      </div>
      <div class="e-rb__secimg">${mosaic(ctx, ROBOT_SET[i], { caption: 'Environnements de travail', cls: 'e-mosaic--pair' })}</div>
    </div>
  </section>`)}

  <section class="e-section" id="caracteristiques" aria-labelledby="t-specs">
    <div class="e-wrap e-pp__two">
      <div>${cartel(4, 'Fiche technique')}<h2 id="t-specs" class="e-h2" data-split>Caractéristiques.</h2></div>
      <div>${specTable(m.specs)}</div>
    </div>
  </section>
  ${ctaCoupon(ctx, { title: 'Voir RoboClean G+ en fonctionnement', text: 'Demandez une présentation : indiquez votre site, la surface et le type de sol.', machine: 'roboclean-g-plus' })}`;
  return layout(ctx, body, { page: 'robot' });
}
