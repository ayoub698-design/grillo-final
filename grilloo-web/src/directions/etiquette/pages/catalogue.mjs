// Étiquette — Catalogue (filters, grid, comparator).
import { html } from '../../../lib/html.mjs';
import { keyFigures } from '../../../lib/view-models.mjs';
import { ENERGY_LABEL, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { cartel, breadcrumbs, productCard, ctaCoupon } from '../components.mjs';
import { icon } from '../icons.mjs';

export function renderCatalogue(ctx) {
  const pg = ctx.data.pages.catalogue;
  const energies = [...new Set(ctx.data.products.map((p) => p.key?.energy).filter(Boolean))];
  const body = html`
  <section class="e-pagehead" aria-labelledby="h1">
    <div class="e-wrap">
      ${breadcrumbs(ctx)}
      ${cartel(null, 'Catalogue 2024', `${ctx.data.products.length} machines`)}
      <h1 id="h1" class="e-h1" data-split>${pg.h1}</h1>
      <p class="e-lead" data-reveal>${fr(pg.intro)}</p>
    </div>
  </section>
  <section class="e-catalogue" data-catalogue aria-label="Machines">
    <div class="e-filters">
      <div class="e-wrap e-filters__in">
        <div class="e-chips" role="radiogroup" aria-label="Gamme">
          <label class="e-chip"><input type="radio" name="gamme" value="" data-filter="gamme" checked><span>Toutes</span></label>
          ${ctx.data.gammes.map((g) => html`<label class="e-chip"><input type="radio" name="gamme" value="${g.slug}" data-filter="gamme"><span>${g.name}</span></label>`)}
        </div>
        <div class="e-filters__row">
          <label class="e-field e-field--search">${icon('search')}<span class="sr">Rechercher</span><input type="search" placeholder="Rechercher un modèle" data-filter="q"></label>
          <label class="e-field"><span class="e-label">Énergie</span><select data-filter="energy"><option value="">Toutes</option>${energies.map((e) => html`<option value="${e}">${ENERGY_LABEL[e]}</option>`)}</select></label>
          <label class="e-field"><span class="e-label">Rendement</span><select data-filter="minProductivity"><option value="">Tous</option>${[1000, 2500, 5000, 10000].map((v) => html`<option value="${v}">≥ ${v.toLocaleString('fr-FR')} m²/h</option>`)}</select></label>
          <label class="e-field"><span class="e-label">Trier</span><select data-filter="sort"><option value="">Par gamme</option><option value="nom">Nom</option><option value="rendement-desc">Rendement décroissant</option><option value="rendement-asc">Rendement croissant</option></select></label>
          <p class="e-filters__count"><b data-count>${ctx.data.products.length}</b> machines</p>
        </div>
      </div>
    </div>
    <div class="e-wrap">
      <div class="e-grid e-catalogue__grid" data-results>
        ${ctx.data.products.map((p) => productCard(ctx, p, keyFigures(p, 3)))}
      </div>
    </div>
  </section>
  ${ctaCoupon(ctx)}`;
  return layout(ctx, body, { data: true });
}
