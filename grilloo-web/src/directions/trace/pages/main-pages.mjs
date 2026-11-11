// Trace — Catalogue, Fiche produit, Gamme, RoboClean G+.
import { html, raw } from '../../../lib/html.mjs';
import { productModel, gammeModel, robotModel, keyFigures } from '../../../lib/view-models.mjs';
import { fmt, fr, ENERGY_LABEL } from '../../../lib/format.mjs';
import { layout } from '../layout.mjs';
import { pageHead, breadcrumbs, eyebrow, button, icon, widthBand, floorTile, genImg, productImg, productCard, specTable, cta, wetTrail, strip } from '../components.mjs';
import { GAMME_SET, ROBOT_SET } from '../../../lib/media.mjs';

const figsOf = (p, n = 3) => keyFigures(p, n + 1).filter((f) => f.key !== 'width').slice(0, n);

// ---------------------------------------------------------------- Catalogue
export function renderCatalogue(ctx) {
  const pg = ctx.data.pages.catalogue;
  const energies = [...new Set(ctx.data.products.map((p) => p.key?.energy).filter(Boolean))];
  const body = html`
  ${pageHead(ctx, { label: 'Catalogue 2024', h1: pg.h1, lead: pg.intro, aside: html`<p class="t-count"><b data-count>${ctx.data.products.length}</b><span class="t-mono">machines</span></p>` })}
  <section class="t-cat" data-catalogue aria-label="Machines">
    <div class="t-passbar">
      <div class="t-wrap t-passbar__in">
        <div class="t-pills" role="radiogroup" aria-label="Gamme">
          <label class="t-pillr"><input type="radio" name="gamme" value="" data-filter="gamme" checked><span>Toutes</span></label>
          ${ctx.data.gammes.map((g) => html`<label class="t-pillr"><input type="radio" name="gamme" value="${g.slug}" data-filter="gamme"><span>${g.name}</span></label>`)}
        </div>
        <div class="t-passbar__tools">
          <label class="t-search">${icon('search')}<span class="sr">Rechercher</span><input type="search" placeholder="Rechercher" data-filter="q"></label>
          <label class="t-sel"><span class="sr">Énergie</span><select data-filter="energy"><option value="">Toutes énergies</option>${energies.map((e) => html`<option value="${e}">${ENERGY_LABEL[e]}</option>`)}</select></label>
          <label class="t-sel"><span class="sr">Rendement minimum</span><select data-filter="minProductivity"><option value="">Tout rendement</option>${[1000, 2500, 5000, 10000].map((v) => html`<option value="${v}">≥ ${v.toLocaleString('fr-FR')} m²/h</option>`)}</select></label>
          <label class="t-sel"><span class="sr">Trier</span><select data-filter="sort"><option value="">Par gamme</option><option value="nom">Nom</option><option value="rendement-desc">Rendement ↓</option><option value="rendement-asc">Rendement ↑</option></select></label>
        </div>
      </div>
    </div>
    <div class="t-wrap"><div class="t-grid t-cat__grid" data-results>${ctx.data.products.map((p) => productCard(ctx, p, figsOf(p)))}</div></div>
  </section>
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true });
}

// ---------------------------------------------------------------- Product
export function renderProduct(ctx, route) {
  const m = productModel(ctx.data, route.params.slug);
  const p = m.p;
  const anchors = [['apercu', 'Aperçu', true], ['caracteristiques', 'Caractéristiques', m.specs.length], ['accessoires', 'Accessoires', m.accessories.length + m.options.length], ['variantes', 'Variantes', m.variants], ['associes', 'Même gamme', m.related.length]].filter((a) => a[2]);
  const body = html`
  <section class="t-pp" aria-labelledby="h1">
    <div class="t-wrap">
      ${breadcrumbs(ctx)}
      <p class="t-mono t-pp__kind" data-fog>${p.kind}${m.energy ? ` · ${m.energy}` : ''} · GRILLOO</p>
      <h1 id="h1" class="t-display t-pp__name" data-dry>${p.name}</h1>
      <div class="t-pp__grid">
        <div class="t-pp__media" data-gallery>
          ${floorTile(ctx, m.images[0], `${p.kind} GRILLOO ${p.name}`, 't-floor--big', true)}
          ${m.images.length > 1 ? html`<div class="t-pp__thumbs">${m.images.map((img, i) => html`<button type="button" data-gallery-src="${ctx.asset(`img/cut/${img}.webp`)}" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="Vue ${i + 1}">${productImg(ctx, img, '')}</button>`)}</div>` : ''}
        </div>
        <div class="t-pp__info">
          ${m.lead ? html`<p class="t-lead" data-fog>${fr(m.lead)}</p>` : ''}
          ${p.key?.width ? html`<div class="t-pp__trace" data-fog><p class="t-mono">Largeur de travail — à l’échelle du catalogue (max. 2 100 mm)</p>${widthBand(p.key.width)}</div>` : ''}
          ${m.keyFigures.length ? html`<dl class="t-figs" data-fog>${m.keyFigures.map((f) => html`<div><dt class="t-mono">${f.label}</dt><dd>${f.value}<small>${f.unit}</small></dd></div>`)}</dl>` : ''}
          <div class="t-actions" data-fog>
            ${button(ctx.link(`contact.html?machine=${p.slug}`), 'Demander un devis')}
            <button class="t-btn t-btn--line" type="button" data-compare-add="${p.slug}" aria-pressed="false"><span class="t-btn__txt">Comparer</span>${icon('plus', 't-btn__ico')}</button>
          </div>
          <a class="t-link" href="${ctx.asset('catalogue-grilloo-2024.pdf')}" download data-fog>Catalogue 2024 · p. ${p.page}</a>
        </div>
      </div>
      <nav class="t-anchors" aria-label="Sections">${anchors.map(([id, l]) => html`<a class="t-pill" href="#${id}">${l}</a>`)}</nav>
    </div>
  </section>
  ${wetTrail()}
  <section class="t-section t-pp__sec" id="apercu" aria-labelledby="t1">
    <div class="t-wrap t-split t-split--top">
      <div>${eyebrow(1, 'Aperçu')}<h2 id="t1" class="t-h3" data-dry>En bref.</h2></div>
      <div class="t-prose">
        ${m.paragraphs.map((t) => html`<p data-fog>${fr(t)}</p>`)}
        ${m.features.length ? html`<ul class="t-feats">${m.features.map((f) => html`<li data-fog>${fr(f)}</li>`)}</ul>` : ''}
        ${!m.paragraphs.length && !m.features.length ? html`<p>Caractéristiques complètes ci-dessous.</p>` : ''}
      </div>
    </div>
  </section>
  ${m.specs.length ? html`<section class="t-section t-pp__sec t-mistsec" id="caracteristiques" aria-labelledby="t2">
    <div class="t-wrap t-split t-split--top">
      <div>${eyebrow(2, 'Caractéristiques')}<h2 id="t2" class="t-h3" data-dry>La fiche technique.</h2><p class="t-mono t-note">Tableau technique du catalogue 2024</p></div>
      <div data-fog>${specTable(m.specs)}</div>
    </div>
  </section>` : ''}
  ${m.accessories.length + m.options.length ? html`<section class="t-section t-pp__sec" id="accessoires" aria-labelledby="t3">
    <div class="t-wrap t-split t-split--top">
      <div>${eyebrow(3, 'Accessoires')}<h2 id="t3" class="t-h3" data-dry>Livré avec.</h2></div>
      <div class="t-accs">
        ${m.accessories.length ? html`<div data-fog><p class="t-mono">Standard</p><ul class="t-list">${m.accessories.map((a) => html`<li>${a}</li>`)}</ul></div>` : ''}
        ${m.options.length ? html`<div data-fog><p class="t-mono">En option</p><ul class="t-list">${m.options.map((a) => html`<li>${a}</li>`)}</ul></div>` : ''}
      </div>
    </div>
  </section>` : ''}
  ${m.variants ? html`<section class="t-section t-pp__sec" id="variantes" aria-labelledby="t4">
    <div class="t-wrap t-split t-split--top">
      <div>${eyebrow(4, 'Variantes')}<h2 id="t4" class="t-h3" data-dry>Les déclinaisons.</h2></div>
      <div class="t-scroll" data-fog><table class="t-specs t-specs--multi"><thead><tr><th></th>${m.variants.columns.map((c) => html`<th scope="col">${c}</th>`)}</tr></thead><tbody>${m.variants.rows.map((r) => html`<tr><th scope="row">${r.label}</th>${r.values.map((v) => html`<td>${v}</td>`)}</tr>`)}</tbody></table></div>
    </div>
  </section>` : ''}
  ${m.related.length ? html`<section class="t-section t-pp__sec" id="associes" aria-labelledby="t5">
    <div class="t-wrap">
      <div class="t-split">${eyebrow(5, m.gamme.name)}<a class="t-link t-right" href="${ctx.link(`gammes/${m.gamme.slug}.html`)}">Toute la gamme</a></div>
      <h2 id="t5" class="t-h2" data-dry>Dans la même gamme.</h2>
      <div class="t-grid t-pp__rel">${m.related.slice(0, 3).map((r) => productCard(ctx, r, figsOf(r)))}</div>
    </div>
  </section>` : ''}
  ${cta(ctx, { title: `Devis GRILLOO ${p.name}.`, text: 'La demande sera pré-remplie avec cette machine. Ajoutez votre surface et votre type de sol.', machine: p.slug })}`;
  return layout(ctx, body, { data: true, page: 'product' });
}

// ---------------------------------------------------------------- Gamme
export function renderGamme(ctx, route) {
  const m = gammeModel(ctx.data, route.params.gamme);
  const r = m.ranges;
  const facts = [['productivity', 'Rendement', 'm²/h'], ['width', 'Largeur', 'mm'], ['tank', 'Capacité', 'L'], ['autonomy', 'Autonomie', 'h'], ['power', 'Puissance', 'W']].filter(([k]) => r[k]).slice(0, 3);
  const body = html`
  ${pageHead(ctx, { label: `${m.g.label} · ${m.count} modèles`, h1: m.g.name, lead: m.g.intro[0] ? fr(m.g.intro[0]) : '', aside: html`<dl class="t-figs t-figs--row" data-fog>${facts.map(([k, l, u]) => html`<div><dt class="t-mono">${l}</dt><dd>${r[k].min === r[k].max ? fmt(r[k].min, 1) : `${fmt(r[k].min, 1)}–${fmt(r[k].max, 1)}`}<small>${u}</small></dd></div>`)}</dl>` })}
  <div class="t-wrap">${strip(ctx, GAMME_SET[m.g.slug])}</div>
  <section class="t-section" aria-labelledby="crit">
    <div class="t-wrap t-split t-split--top">
      <div>${eyebrow(1, 'Critères')}<h2 id="crit" class="t-h3" data-dry>Ce qui départage les modèles.</h2></div>
      <ol class="t-crit">${m.g.criteria.map((c, i) => html`<li data-fog><span class="t-mono">${String(i + 1).padStart(2, '0')}</span>${c}</li>`)}</ol>
    </div>
  </section>
  <section class="t-section t-mistsec" aria-labelledby="models">
    <div class="t-wrap">
      ${eyebrow(2, 'Les modèles')}
      <h2 id="models" class="t-h2" data-dry>${m.count} machines, à l’échelle.</h2>
      <ol class="t-rows">${m.cards.map(({ p, keyFigures: f, file }) => html`<li class="t-row" data-fog>
        <a class="t-row__media" href="${ctx.link(file)}" tabindex="-1" aria-hidden="true">${productImg(ctx, p.img, '')}</a>
        <div class="t-row__main"><p class="t-mono">${p.kind}</p><h3 class="t-row__name"><a href="${ctx.link(file)}">${p.name}</a></h3>${widthBand(p.key?.width)}</div>
        <ul class="t-row__figs">${f.filter((x) => x.key !== 'width').map((x) => html`<li><span class="t-mono">${x.label}</span><b>${x.value}</b><small>${x.unit}</small></li>`)}</ul>
        <div class="t-row__act"><button class="t-cmp" type="button" data-compare-add="${p.slug}" aria-pressed="false">${icon('plus', 't-cmp__ico')}<span>Comparer</span></button><a class="t-row__go" href="${ctx.link(file)}" aria-label="Fiche ${p.name}">${icon('arrow')}</a></div>
      </li>`)}</ol>
    </div>
  </section>
  ${m.faq.length ? html`<section class="t-section" aria-labelledby="faq">
    <div class="t-wrap t-split t-split--top">
      <div>${eyebrow(3, 'Questions')}<h2 id="faq" class="t-h3" data-dry>Questions fréquentes.</h2></div>
      <div class="t-faq">${m.faq.map((f) => html`<details data-fog><summary>${f.q}<span aria-hidden="true"></span></summary><p>${fr(f.a)}</p></details>`)}</div>
    </div>
  </section>` : ''}
  <section class="t-others"><div class="t-wrap"><p class="t-mono">Autres gammes</p><div class="t-others__row">${ctx.data.gammes.filter((g) => g.slug !== m.g.slug).map((g) => html`<a class="t-pill" href="${ctx.link(`gammes/${g.slug}.html`)}">${g.name}</a>`)}</div></div></section>
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true, page: 'gamme' });
}

// ---------------------------------------------------------------- RoboClean G+
export function renderRobot(ctx) {
  const m = robotModel(ctx.data);
  const imgs = ['amb-mall', 'amb-clinique', 'amb-gare'];
  const body = html`
  <section class="t-pp t-rb" aria-labelledby="h1">
    <div class="t-wrap">
      ${breadcrumbs(ctx)}
      <p class="t-mono" data-fog>Autolaveuse autonome · lithium-ion · GRILLOO</p>
      <h1 id="h1" class="t-display t-pp__name" data-dry>RoboClean G+</h1>
      <div class="t-pp__grid">
        <div class="t-pp__media">${floorTile(ctx, m.p.img, 'Autolaveuse autonome GRILLOO RoboClean G+', 't-floor--big', true)}</div>
        <div class="t-pp__info">
          <p class="t-lead" data-fog>${fr(ctx.data.pages.robot.intro)} ${fr(m.lead)}</p>
          <p class="t-body" data-fog>${fr(m.intro)}</p>
          <dl class="t-figs t-figs--3" data-fog>${m.figures.map((f) => html`<div><dt class="t-mono">${f.key === 'productivity' ? 'Max. mode autonome' : f.key === 'tank' ? 'Eau propre / sale' : f.key === 'power' ? 'Puissance absorbée' : f.label}</dt><dd>${f.value}<small>${f.unit}</small></dd></div>`)}</dl>
          <div class="t-actions" data-fog>${button(ctx.link('contact.html?machine=roboclean-g-plus'), 'Demander une présentation')}${button('#caracteristiques', 'Caractéristiques', { variant: 'line', iconName: 'arrow-down' })}</div>
        </div>
      </div>
    </div>
  </section>
  ${m.sections.map((s, i) => html`<section class="t-section t-alt${i % 2 ? ' t-alt--r' : ''}" aria-labelledby="rb${i}">
    <div class="t-wrap t-alt__grid">
      <div class="t-alt__img t-alt__strip">${strip(ctx, ROBOT_SET[i])}</div>
      <div class="t-alt__text">${eyebrow(i + 1, ['Accessibilité', 'Sécurité', 'Décisions'][i])}<h2 id="rb${i}" class="t-h3" data-dry>${s.title}</h2>${s.paragraphs.map((t) => html`<p class="t-body" data-fog>${fr(t)}</p>`)}</div>
    </div>
  </section>`)}
  <section class="t-section t-mistsec" id="caracteristiques" aria-labelledby="specs">
    <div class="t-wrap t-split t-split--top">
      <div>${eyebrow(4, 'Fiche technique')}<h2 id="specs" class="t-h3" data-dry>Caractéristiques.</h2></div>
      <div data-fog>${specTable(m.specs)}</div>
    </div>
  </section>
  ${cta(ctx, { title: 'Voir RoboClean G+ en fonctionnement.', text: 'Demandez une présentation : indiquez votre site, la surface et le type de sol.', machine: 'roboclean-g-plus' })}`;
  return layout(ctx, body, { page: 'robot' });
}
