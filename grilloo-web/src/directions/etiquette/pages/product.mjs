// Étiquette — Fiche produit (fiche technique).
import { html } from '../../../lib/html.mjs';
import { productModel, keyFigures } from '../../../lib/view-models.mjs';
import { fmt, fr } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { breadcrumbs, tag, button, figure, productImg, productCard, specTable, ctaCoupon } from '../components.mjs';
import { icon } from '../icons.mjs';

const WIDTH_RE = /largeur (d.op.ration|de travail|du chemin|de nettoyage|propre|de balayage|chemin)|chemin de brosse|balayage chemins/i;

export function renderProduct(ctx, route) {
  const m = productModel(ctx.data, route.params.slug);
  const p = m.p;
  const tabs = [
    ['apercu', 'Aperçu', true],
    ['caracteristiques', 'Caractéristiques', m.specs.length > 0],
    ['accessoires', 'Accessoires', m.accessories.length + m.options.length > 0],
    ['variantes', 'Variantes', !!m.variants],
    ['associes', 'Associés', m.related.length > 0],
  ].filter((t) => t[2]);
  const body = html`
  <section class="e-pp" aria-labelledby="h1">
    <div class="e-wrap">
      ${breadcrumbs(ctx)}
      <div class="e-pp__grid">
        <div class="e-pp__media" data-gallery>
          <div class="e-pp__plinth">
            ${productImg(ctx, m.images[0], `${p.kind} GRILLOO ${p.name}`, 'e-pp__img', true)}
            ${p.key?.width ? html`<div class="e-dim e-pp__dim" data-dim-target="width"><span class="e-dim__line"></span><p><span class="e-label">Largeur de travail</span><b>${fmt(p.key.width)}<small>mm</small></b></p></div>` : ''}
          </div>
          ${m.images.length > 1 ? html`<div class="e-pp__thumbs">${m.images.map((img, i) => html`<button type="button" class="e-pp__thumb" data-gallery-src="${ctx.asset(`img/cut/${img}.webp`)}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="Vue ${i + 1}">${productImg(ctx, img, '')}</button>`)}</div>` : ''}
          <p class="e-caption"><span class="e-caption__fig">Réf.</span> GRILLOO ${p.name} — catalogue 2024, p. ${p.page}</p>
        </div>
        <div class="e-pp__info">
          <div class="e-pp__tags">${tag(p.kind)}${m.energy ? tag(m.energy, 'e-tag--line') : ''}</div>
          <h1 id="h1" class="e-pp__title"><span class="e-pp__brand">GRILLOO</span><span data-split>${p.name}</span></h1>
          ${m.lead ? html`<p class="e-lead" data-reveal>${fr(m.lead)}</p>` : ''}
          ${m.keyFigures.length ? html`<div class="e-pp__figs" data-reveal>${m.keyFigures.map((f) => figure(f))}</div>` : ''}
          <div class="e-pp__actions" data-reveal>
            ${button(ctx.link(`contact.html?machine=${p.slug}`), 'Demander un devis')}
            <button class="e-btn e-btn--line" type="button" data-compare-add="${p.slug}" aria-pressed="false"><span class="e-btn__txt">Comparer</span>${icon('plus', 'e-btn__ico')}</button>
          </div>
          <a class="e-link" href="${ctx.asset('catalogue-grilloo-2024.pdf')}" download data-reveal>Catalogue 2024 (PDF) ${icon('download', 'e-link__ico')}</a>
          ${m.sectors.length ? html`<div class="e-pp__sectors" data-reveal><span class="e-label">Recommandé pour</span>${m.sectors.map((s) => html`<a class="e-tag e-tag--line" href="${ctx.link('secteurs.html')}#${s.slug}">${s.name}</a>`)}</div>` : ''}
        </div>
      </div>
    </div>
  </section>

  <nav class="e-tabs" aria-label="Sections de la fiche" data-tabs>
    <div class="e-wrap e-tabs__in">
      ${tabs.map(([id, label], i) => html`<a href="#${id}" class="e-tabs__link${i === 0 ? ' is-active' : ''}" data-tab="${id}">${label}</a>`)}
      <span class="e-tabs__ind" data-tabs-ind></span>
    </div>
  </nav>

  <section class="e-section e-pp__sec" id="apercu" aria-labelledby="t-apercu">
    <div class="e-wrap e-pp__two">
      <div><span class="e-label">01</span><h2 id="t-apercu" class="e-h3">Aperçu</h2></div>
      <div class="e-pp__prose">
        ${m.paragraphs.map((t) => html`<p data-reveal>${fr(t)}</p>`)}
        ${m.features.length ? html`<ul class="e-feats">${m.features.map((f) => html`<li data-reveal><span class="e-tri" aria-hidden="true"></span>${fr(f)}</li>`)}</ul>` : ''}
        ${!m.paragraphs.length && !m.features.length ? html`<p>${p.kind} GRILLOO ${p.name} : caractéristiques complètes ci-dessous.</p>` : ''}
      </div>
    </div>
  </section>

  ${m.specs.length ? html`<section class="e-section e-pp__sec" id="caracteristiques" aria-labelledby="t-specs">
    <div class="e-wrap e-pp__two">
      <div><span class="e-label">02</span><h2 id="t-specs" class="e-h3">Caractéristiques techniques</h2><p class="e-body e-pp__note">Valeurs du tableau technique du catalogue 2024.</p></div>
      <div>${specTable(m.specs, { dimKeys: { width: WIDTH_RE } })}</div>
    </div>
  </section>` : ''}

  ${m.accessories.length + m.options.length ? html`<section class="e-section e-pp__sec" id="accessoires" aria-labelledby="t-acc">
    <div class="e-wrap e-pp__two">
      <div><span class="e-label">03</span><h2 id="t-acc" class="e-h3">Accessoires</h2></div>
      <div class="e-pp__acc">
        ${m.accessories.length ? html`<div><p class="e-label">Standard</p><ul class="e-list">${m.accessories.map((a) => html`<li>${a}</li>`)}</ul></div>` : ''}
        ${m.options.length ? html`<div><p class="e-label">En option</p><ul class="e-list">${m.options.map((a) => html`<li>${a}</li>`)}</ul></div>` : ''}
      </div>
    </div>
  </section>` : ''}

  ${m.variants ? html`<section class="e-section e-pp__sec" id="variantes" aria-labelledby="t-var">
    <div class="e-wrap e-pp__two">
      <div><span class="e-label">04</span><h2 id="t-var" class="e-h3">Variantes</h2></div>
      <div class="e-scroll"><table class="e-specs e-specs--multi"><thead><tr><th></th>${m.variants.columns.map((c) => html`<th scope="col">${c}</th>`)}</tr></thead>
        <tbody>${m.variants.rows.map((r) => html`<tr><th scope="row">${r.label}</th>${r.values.map((v) => html`<td>${v}</td>`)}</tr>`)}</tbody></table></div>
    </div>
  </section>` : ''}

  ${m.related.length ? html`<section class="e-section e-pp__sec" id="associes" aria-labelledby="t-rel">
    <div class="e-wrap">
      <div class="e-pp__relhead"><div><span class="e-label">05</span><h2 id="t-rel" class="e-h3">Dans la même gamme</h2></div><a class="e-link" href="${ctx.link(`gammes/${m.gamme.slug}.html`)}">${m.gamme.name} ${icon('arrow', 'e-link__ico')}</a></div>
      <div class="e-grid">${m.related.map((r) => productCard(ctx, r, keyFigures(r, 3)))}</div>
    </div>
  </section>` : ''}

  ${ctaCoupon(ctx, { title: `Devis GRILLOO ${p.name}`, text: 'Indiquez votre surface et votre type de sol : la demande sera pré-remplie avec cette machine.', machine: p.slug })}`;
  return layout(ctx, body, { data: true, page: 'product' });
}
