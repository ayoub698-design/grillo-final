// Rondeur — Catalogue, Fiche produit, Gamme, RoboClean G+.
import { html } from '../../../lib/html.mjs';
import { productModel, gammeModel, robotModel, keyFigures } from '../../../lib/view-models.mjs';
import { fmt, fr, ENERGY_LABEL } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { pageHead, breadcrumbs, kicker, button, icon, porthole, productImg, genImg, productCard, specTable, cta, circleChain, cluster } from '../components.mjs';
import { GAMME_SET, ROBOT_SET } from '../../../lib/media.mjs';

const figs3 = (p) => keyFigures(p, 3);

export function renderCatalogue(ctx) {
  const pg = ctx.data.pages.catalogue;
  const energies = [...new Set(ctx.data.products.map((p) => p.key?.energy).filter(Boolean))];
  const body = html`
  ${pageHead(ctx, { label: 'Catalogue 2024', h1: pg.h1, lead: pg.intro, extra: html`<p class="r-count" data-pop><b data-count>${ctx.data.products.length}</b><span>machines</span></p>` })}
  <section class="r-cat" data-catalogue aria-label="Machines">
    <div class="r-wrap r-filters">
      <div class="r-chips" role="radiogroup" aria-label="Gamme">
        <label class="r-chip"><input type="radio" name="gamme" value="" data-filter="gamme" checked><span>Toutes</span></label>
        ${ctx.data.gammes.map((g) => html`<label class="r-chip"><input type="radio" name="gamme" value="${g.slug}" data-filter="gamme"><span>${g.name}</span></label>`)}
      </div>
      <div class="r-tools">
        <label class="r-pillin">${icon('search')}<span class="sr">Rechercher</span><input type="search" placeholder="Rechercher" data-filter="q"></label>
        <label class="r-pillin"><span class="sr">Énergie</span><select data-filter="energy"><option value="">Toutes énergies</option>${energies.map((e) => html`<option value="${e}">${ENERGY_LABEL[e]}</option>`)}</select></label>
        <label class="r-pillin"><span class="sr">Rendement minimum</span><select data-filter="minProductivity"><option value="">Tout rendement</option>${[1000, 2500, 5000, 10000].map((v) => html`<option value="${v}">≥ ${v.toLocaleString('fr-FR')} m²/h</option>`)}</select></label>
        <label class="r-pillin"><span class="sr">Trier</span><select data-filter="sort"><option value="">Par gamme</option><option value="nom">Nom</option><option value="rendement-desc">Rendement décroissant</option><option value="rendement-asc">Rendement croissant</option></select></label>
      </div>
    </div>
    <div class="r-wrap"><div class="r-grid" data-results>${ctx.data.products.map((p) => productCard(ctx, p, figs3(p)))}</div></div>
  </section>
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true });
}

export function renderProduct(ctx, route) {
  const m = productModel(ctx.data, route.params.slug);
  const p = m.p;
  const anchors = [['apercu', 'Aperçu', true], ['caracteristiques', 'Caractéristiques', m.specs.length], ['accessoires', 'Accessoires', m.accessories.length + m.options.length], ['variantes', 'Variantes', m.variants], ['associes', 'Même gamme', m.related.length]].filter((a) => a[2]);
  const body = html`
  <section class="r-pp" aria-labelledby="h1">
    <div class="r-wrap">
      ${breadcrumbs(ctx)}
      <div class="r-pp__grid">
        <div data-gallery data-pop>
          ${porthole(ctx, m.images[0], `${p.kind} GRILLOO ${p.name}`, m.keyFigures, { size: 'r-hub--xl', eager: true })}
          ${m.images.length > 1 ? html`<div class="r-pp__thumbs">${m.images.map((img, i) => html`<button type="button" data-gallery-src="${ctx.asset(`img/cut/${img}.webp`)}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="Vue ${i + 1}">${productImg(ctx, img, '')}</button>`)}</div>` : ''}
        </div>
        <div class="r-pp__info">
          <div class="r-pp__kind" data-pop><span class="r-tag r-tag--cyan">${p.kind}</span>${m.energy ? html`<span class="r-tag">${m.energy}</span>` : ''}</div>
          <h1 id="h1" class="r-pp__title"><small>GRILLOO</small><span data-rise>${p.name}</span></h1>
          ${m.lead ? html`<p class="r-lead" data-pop>${fr(m.lead)}</p>` : ''}
          <div class="r-pp__actions" data-pop>
            ${button(ctx.link(`contact.html?machine=${p.slug}`), 'Demander un devis')}
            <button class="r-btn r-btn--line" type="button" data-compare-add="${p.slug}" aria-pressed="false"><span class="r-btn__txt">Comparer</span><span class="r-btn__ico">${icon('plus')}</span></button>
          </div>
          <a class="r-link" href="${ctx.asset('catalogue-grilloo-2024.pdf')}" download data-pop>Catalogue 2024 · page ${p.page}</a>
          ${m.sectors.length ? html`<div class="r-pp__kind" data-pop>${m.sectors.map((s) => html`<a class="r-tag" href="${ctx.link('secteurs.html')}#${s.slug}">${s.name}</a>`)}</div>` : ''}
        </div>
      </div>
      <nav class="r-anchors" aria-label="Sections">${anchors.map(([id, l]) => html`<a href="#${id}">${l}</a>`)}</nav>
    </div>
  </section>
  <section class="r-section r-sec" id="apercu" aria-labelledby="t1"><div class="r-wrap"><div class="r-col">
    <div class="r-sec__head">${kicker(1, 'Aperçu')}<h2 id="t1" class="r-h3" data-rise>En quelques mots.</h2></div>
    <div class="r-prose">${m.paragraphs.map((t) => html`<p data-pop>${fr(t)}</p>`)}${!m.paragraphs.length && !m.features.length ? html`<p>Caractéristiques complètes ci-dessous.</p>` : ''}</div>
    ${m.features.length ? html`<ul class="r-feats" data-pop>${m.features.map((f) => html`<li>${fr(f)}</li>`)}</ul>` : ''}
  </div></div></section>
  ${m.specs.length ? html`<section class="r-section r-sec r-foam" id="caracteristiques" aria-labelledby="t2"><div class="r-wrap"><div class="r-col">
    <div class="r-sec__head">${kicker(2, 'Caractéristiques')}<h2 id="t2" class="r-h3" data-rise>La fiche technique.</h2><p class="r-note">Tableau technique du catalogue 2024</p></div>
    <div data-pop>${specTable(m.specs)}</div>
  </div></div></section>` : ''}
  ${m.accessories.length + m.options.length ? html`<section class="r-section r-sec" id="accessoires" aria-labelledby="t3"><div class="r-wrap"><div class="r-col">
    <div class="r-sec__head">${kicker(3, 'Accessoires')}<h2 id="t3" class="r-h3" data-rise>Livré avec.</h2></div>
    <div class="r-accs" data-pop>
      ${m.accessories.length ? html`<div><p class="r-label">Standard</p><ul>${m.accessories.map((a) => html`<li>${a}</li>`)}</ul></div>` : ''}
      ${m.options.length ? html`<div><p class="r-label">En option</p><ul>${m.options.map((a) => html`<li>${a}</li>`)}</ul></div>` : ''}
    </div>
  </div></div></section>` : ''}
  ${m.variants ? html`<section class="r-section r-sec" id="variantes" aria-labelledby="t4"><div class="r-wrap"><div class="r-col">
    <div class="r-sec__head">${kicker(4, 'Variantes')}<h2 id="t4" class="r-h3" data-rise>Les déclinaisons.</h2></div>
    <div class="r-scroll" data-pop><table class="r-specs r-specs--multi"><thead><tr><th></th>${m.variants.columns.map((c) => html`<th scope="col">${c}</th>`)}</tr></thead><tbody>${m.variants.rows.map((r) => html`<tr><th scope="row">${r.label}</th>${r.values.map((v) => html`<td>${v}</td>`)}</tr>`)}</tbody></table></div>
  </div></div></section>` : ''}
  ${m.related.length ? html`<section class="r-section r-sec" id="associes" aria-labelledby="t5"><div class="r-wrap">
    <div class="r-sec__head">${kicker(5, m.gamme.name)}<h2 id="t5" class="r-h2" data-rise>Dans la même gamme.</h2></div>
    <div class="r-grid">${m.related.slice(0, 3).map((r) => productCard(ctx, r, figs3(r)))}</div>
    <div class="r-center" style="margin-top:48px"><a class="r-link" href="${ctx.link(`gammes/${m.gamme.slug}.html`)}">Toute la gamme ${m.gamme.name}</a></div>
  </div></section>` : ''}
  ${cta(ctx, { title: `Devis GRILLOO ${p.name}`, text: 'La demande sera pré-remplie avec cette machine.', machine: p.slug })}`;
  return layout(ctx, body, { data: true, page: 'product' });
}

export function renderGamme(ctx, route) {
  const m = gammeModel(ctx.data, route.params.gamme);
  const r = m.ranges;
  const facts = [['productivity', 'm²/h'], ['width', 'mm de largeur'], ['tank', 'litres'], ['autonomy', 'h d’autonomie'], ['power', 'W']].filter(([k]) => r[k]).slice(0, 3);
  const body = html`
  ${pageHead(ctx, { label: `${m.count} modèles`, h1: m.g.name, lead: m.g.intro[0] ? fr(m.g.intro[0]) : '', extra: html`<div class="r-badges" data-pop>${facts.map(([k, u]) => html`<span class="r-badge"><b>${r[k].min === r[k].max ? fmt(r[k].min, 1) : `${fmt(r[k].min, 1)}–${fmt(r[k].max, 1)}`}</b><small>${u}</small></span>`)}</div>` })}
  <div class="r-wrap">${cluster(ctx, GAMME_SET[m.g.slug], { cls: 'r-cluster--wide' })}</div>
  <section class="r-section" aria-labelledby="crit"><div class="r-wrap r-center">
    ${kicker(1, 'Critères')}<h2 id="crit" class="r-h2" data-rise>Ce qui départage les modèles.</h2>
    <ol class="r-crit" data-pop>${m.g.criteria.map((c, i) => html`<li><span>${String(i + 1).padStart(2, '0')}</span>${c}</li>`)}</ol>
  </div></section>
  <section class="r-section r-foam" aria-labelledby="models"><div class="r-wrap">
    <div class="r-sec__head">${kicker(2, 'Les modèles')}<h2 id="models" class="r-h2" data-rise>${m.count} machines.</h2></div>
    <div class="r-grid">${m.items.map((p) => productCard(ctx, p, figs3(p)))}</div>
  </div></section>
  ${m.faq.length ? html`<section class="r-section" aria-labelledby="faq"><div class="r-wrap"><div class="r-col">
    <div class="r-sec__head">${kicker(3, 'Questions')}<h2 id="faq" class="r-h3" data-rise>Questions fréquentes.</h2></div>
    <div class="r-faq">${m.faq.map((f) => html`<details data-pop><summary>${f.q}</summary><p>${fr(f.a)}</p></details>`)}</div>
  </div></div></section>` : ''}
  <section class="r-section" style="padding-top:0"><div class="r-wrap r-center">${circleChain()}<div class="r-chips">${ctx.data.gammes.filter((g) => g.slug !== m.g.slug).map((g) => html`<a class="r-tag" href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a>`)}</div></div></section>
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true, page: 'gamme' });
}

export function renderRobot(ctx) {
  const m = robotModel(ctx.data);
  const imgs = ['amb-mall', 'amb-clinique', 'amb-gare'];
  const figs = m.figures.filter((f) => ['productivity', 'width', 'tank', 'autonomy'].includes(f.key));
  const body = html`
  <section class="r-pp" aria-labelledby="h1"><div class="r-wrap">
    ${breadcrumbs(ctx)}
    <div class="r-pp__grid">
      <div data-pop>${porthole(ctx, m.p.img, 'Autolaveuse autonome GRILLOO RoboClean G+', figs, { size: 'r-hub--xl', eager: true })}</div>
      <div class="r-pp__info">
        <div class="r-pp__kind" data-pop><span class="r-tag r-tag--cyan">Autolaveuse autonome</span><span class="r-tag">Lithium-ion</span></div>
        <h1 id="h1" class="r-pp__title"><small>GRILLOO</small><span data-rise>RoboClean G+</span></h1>
        <p class="r-lead" data-pop>${fr(ctx.data.pages.robot.intro)} ${fr(m.lead)}</p>
        <p class="r-body" data-pop>${fr(m.intro)}</p>
        <div class="r-pp__actions" data-pop>${button(ctx.link('contact.html?machine=roboclean-g-plus'), 'Demander une présentation')}</div>
      </div>
    </div>
  </div></section>
  ${m.sections.map((s, i) => html`<section class="r-section" aria-labelledby="rb${i}"><div class="r-wrap r-alt${i % 2 ? ' r-alt--r' : ''}">
    <div class="r-alt__cl">${cluster(ctx, ROBOT_SET[i])}</div>
    <div class="r-alt__text">${kicker(i + 1, ['Accessibilité', 'Sécurité', 'Décisions'][i])}<h2 id="rb${i}" class="r-h3" data-rise>${s.title}</h2>${s.paragraphs.map((t) => html`<p class="r-body" data-pop>${fr(t)}</p>`)}</div>
  </div></section>`)}
  <section class="r-section r-foam" id="caracteristiques" aria-labelledby="specs"><div class="r-wrap"><div class="r-col">
    <div class="r-sec__head">${kicker(4, 'Fiche technique')}<h2 id="specs" class="r-h3" data-rise>Caractéristiques.</h2></div>
    <div data-pop>${specTable(m.specs)}</div>
  </div></div></section>
  ${cta(ctx, { title: 'Voir RoboClean G+ en fonctionnement.', text: 'Demandez une présentation : indiquez votre site, la surface et le type de sol.', machine: 'roboclean-g-plus' })}`;
  return layout(ctx, body, { page: 'robot' });
}
