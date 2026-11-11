// Étiquette — Page gamme.
import { html } from '../../../lib/html.mjs';
import { gammeModel } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { breadcrumbs, cartel, figure, genImg, productImg, ctaCoupon, notchRule, mosaic } from '../components.mjs';
import { GAMME_SET } from '../../../lib/media.mjs';
import { icon } from '../icons.mjs';

const COLS = [
  ['productivity', 'Rendement', 'm²/h'],
  ['width', 'Largeur', 'mm'],
  ['tank', 'Réservoir', 'L'],
  ['autonomy', 'Autonomie', 'h'],
  ['power', 'Puissance', 'W'],
  ['weight', 'Poids', 'kg'],
];
const RANGE_LABEL = { productivity: 'Rendement', width: 'Largeur de travail', tank: 'Capacité', autonomy: 'Autonomie', power: 'Puissance', weight: 'Poids' };

export function renderGamme(ctx, route) {
  const m = gammeModel(ctx.data, route.params.gamme);
  const cols = COLS.filter(([k]) => m.items.some((p) => typeof p.key?.[k] === 'number'));
  const ranges = COLS.filter(([k]) => m.ranges[k]).slice(0, 4);
  const body = html`
  <section class="e-pagehead" aria-labelledby="h1">
    <div class="e-wrap">
      ${breadcrumbs(ctx)}
      ${cartel(null, m.g.label, `${m.count} modèles`)}
      <div class="e-gh">
        <h1 id="h1" class="e-h1" data-split>${m.g.name}</h1>
        <div class="e-gh__intro">${m.g.intro.map((t) => html`<p class="e-lead" data-reveal>${fr(t)}</p>`)}</div>
      </div>
      ${ranges.length ? html`<div class="e-gh__figs" data-reveal>${ranges.map(([k, , unit]) => {
        const r = m.ranges[k];
        return figure({ value: r.min === r.max ? fmt(r.min, 1) : `${fmt(r.min, 1)}–${fmt(r.max, 1)}`, unit, label: RANGE_LABEL[k] });
      })}</div>` : ''}
    </div>
  </section>
  <div class="e-wrap">${mosaic(ctx, [GAMME_SET[m.g.slug][0], GAMME_SET[m.g.slug][1], { product: [...m.items].sort((a, b) => (b.key?.productivity ?? 0) - (a.key?.productivity ?? 0))[0] }])}</div>

  <section class="e-section" aria-labelledby="crit-title">
    <div class="e-wrap e-crit">
      <div>${cartel(1, 'Critères de choix')}<h2 id="crit-title" class="e-h2" data-split>Ce qui départage les modèles.</h2></div>
      <ol class="e-crit__list">${m.g.criteria.map((c, i) => html`<li data-reveal><span>${String(i + 1).padStart(2, '0')}</span>${c}</li>`)}</ol>
    </div>
  </section>

  <section class="e-section" aria-labelledby="models-title">
    <div class="e-wrap">
      ${cartel(2, 'Les modèles', `${m.count} machines`)}
      <h2 id="models-title" class="e-h2" data-split>Comparer d’un coup d’œil.</h2>
      <div class="e-scroll e-mtable-wrap" data-reveal>
        <table class="e-mtable">
          <thead><tr><th scope="col">Modèle</th>${cols.map(([, l, u]) => html`<th scope="col">${l}<small>${u}</small></th>`)}<th><span class="sr">Actions</span></th></tr></thead>
          <tbody>
            ${m.cards.map(({ p, file }) => html`<tr>
              <th scope="row"><a class="e-mtable__model" href="${ctx.link(file)}"><span class="e-mtable__thumb">${productImg(ctx, p.img, '')}</span><span><span class="e-card__brand">GRILLOO</span> <b>${p.name}</b><span class="e-mtable__kind">${p.kind}</span></span></a></th>
              ${cols.map(([k]) => html`<td>${typeof p.key?.[k] === 'number' ? fmt(p.key[k], 1) : '—'}</td>`)}
              <td class="e-mtable__act"><button class="e-cmp" type="button" data-compare-add="${p.slug}" aria-pressed="false">${icon('plus', 'e-cmp__ico')}<span>Comparer</span></button><a class="e-mtable__go" href="${ctx.link(file)}" aria-label="Fiche ${p.name}">${icon('arrow')}</a></td>
            </tr>`)}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  ${m.faq.length ? html`<section class="e-section" aria-labelledby="faq-title">
    <div class="e-wrap e-faq">
      <div>${cartel(3, 'Questions')}<h2 id="faq-title" class="e-h2" data-split>Questions fréquentes.</h2></div>
      <div class="e-faq__list">${m.faq.map((f) => html`<details class="e-faq__item" data-reveal><summary><span>${f.q}</span>${icon('plus', 'e-faq__ico')}</summary><div class="e-faq__a"><p>${fr(f.a)}</p></div></details>`)}</div>
    </div>
  </section>` : ''}
  <section class="e-section e-gnext"><div class="e-wrap">${notchRule('20%')}<div class="e-gnext__row">${ctx.data.gammes.filter((g) => g.slug !== m.g.slug).map((g) => html`<a class="e-link" href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name} ${icon('arrow', 'e-link__ico')}</a>`)}</div></div></section>
  ${ctaCoupon(ctx)}`;
  return layout(ctx, body, { data: true, page: 'gamme' });
}
