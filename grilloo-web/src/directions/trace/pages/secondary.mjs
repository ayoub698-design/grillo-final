// Trace — Secteurs, Guide de choix, Guide pierre, À propos, Contact.
import { html, raw } from '../../../lib/html.mjs';
import { sectorsModel, keyFigures } from '../../../lib/view-models.mjs';
import { productBySlug } from '../../../lib/data.mjs';
import { fr, ENERGY_LABEL } from '../../../lib/format.mjs';
import { NOTE } from '../../../lib/guide.mjs';
import { layout } from '../layout.mjs';
import { pageHead, eyebrow, button, icon, genImg, productCard, cta, wetTrail, strip } from '../components.mjs';
import { SECTOR_SET, STONE_SET, ABOUT_SET } from '../../../lib/media.mjs';

const pad = (n) => String(n).padStart(2, '0');
const figsOf = (p) => keyFigures(p, 4).filter((f) => f.key !== 'width').slice(0, 3);

export function renderSecteurs(ctx) {
  const pg = ctx.data.pages.secteurs;
  const sectors = sectorsModel(ctx.data);
  const body = html`
  ${pageHead(ctx, { label: 'Secteurs', h1: pg.h1, lead: pg.intro })}
  <nav class="t-wrap t-anchors t-anchors--top" aria-label="Secteurs">${sectors.map((s) => html`<a class="t-pill" href="#${s.slug}">${s.name}</a>`)}</nav>
  ${sectors.map((s, i) => html`<section class="t-section t-sector${i % 2 ? ' t-mistsec' : ''}" id="${s.slug}" aria-labelledby="s-${s.slug}">
    <div class="t-wrap">
      <div class="t-alt__grid${i % 2 ? ' t-alt--r' : ''}">
        <div class="t-alt__img t-alt__strip">${strip(ctx, SECTOR_SET[s.slug].slice(0, 2))}</div>
        <div class="t-alt__text">${eyebrow(i + 1, `${s.products.length} machines`)}<h2 id="s-${s.slug}" class="t-h3" data-dry>${s.name}</h2><p class="t-lead" data-fog>${fr(s.intro)}</p></div>
      </div>
      <div class="t-grid t-sector__grid">${s.products.slice(0, 6).map((p) => productCard(ctx, p, figsOf(p)))}</div>
      ${s.products.length > 6 ? html`<p class="t-more t-mono">+ ${s.products.length - 6} autres machines dans le <a class="t-link" href="${ctx.link('catalogue.html')}">catalogue</a></p>` : ''}
    </div>
  </section>`)}
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true });
}

export function renderGuide(ctx) {
  const pg = ctx.data.pages.guide;
  const types = [['dur', 'Sol dur'], ['textile', 'Moquette & textiles'], ['exterieur', 'Extérieur & voirie'], ['escalator', 'Escalators']];
  const body = html`
  ${pageHead(ctx, { label: 'Guide de choix · estimation indicative', h1: pg.h1, lead: pg.intro })}
  <form class="t-guide" data-guide>
    <section class="t-gpass" aria-labelledby="p1"><div class="t-wrap t-gpass__in">
      <p class="t-mono t-gpass__n">Passage 01</p><h2 id="p1" class="t-gpass__q">Quelle surface ?</h2>
      <div class="t-gpass__opts">${types.map(([v, l], i) => html`<label class="t-chip"><input type="radio" name="surfaceType" value="${v}" ${raw(i === 0 ? 'checked' : '')}><span>${icon(v)}${l}</span></label>`)}</div>
    </div></section>
    <section class="t-gpass" aria-labelledby="p2"><div class="t-wrap t-gpass__in">
      <p class="t-mono t-gpass__n">Passage 02</p><h2 id="p2" class="t-gpass__q">Combien, en combien de temps ?</h2>
      <div class="t-gpass__nums">
        <label class="t-bignum"><span class="t-mono">Surface à nettoyer</span><span><input type="number" name="area" min="1" step="50" value="2000" inputmode="numeric"><small>m²</small></span></label>
        <label class="t-bignum"><span class="t-mono">Temps disponible par passage</span><span><input type="number" name="hours" min="0.5" step="0.5" value="1" inputmode="decimal"><small>h</small></span></label>
      </div>
    </div></section>
    <section class="t-gpass" aria-labelledby="p3"><div class="t-wrap t-gpass__in">
      <p class="t-mono t-gpass__n">Passage 03</p><h2 id="p3" class="t-gpass__q">Des contraintes ?</h2>
      <div class="t-gpass__opts">
        <label class="t-chip"><input type="radio" name="energy" value="indifferent" checked><span>Énergie indifférente</span></label>
        ${['batterie', 'secteur', 'manuel'].map((e) => html`<label class="t-chip"><input type="radio" name="energy" value="${e}"><span>${ENERGY_LABEL[e]}</span></label>`)}
        <label class="t-chip t-chip--check"><input type="checkbox" name="cluttered"><span>Espaces encombrés</span></label>
      </div>
    </div></section>
  </form>
  ${wetTrail()}
  <section class="t-section t-gres" aria-live="polite" aria-labelledby="res">
    <div class="t-wrap">
      <div class="t-split"><div>${eyebrow(null, 'Résultat')}<h2 id="res" class="t-h3">Rendement nécessaire</h2></div><p class="t-gres__need"><b data-guide-needed>2 000</b> <small>m²/h</small></p></div>
      <p class="t-mono t-note">${NOTE}</p>
      <div class="t-grid t-gres__grid" data-guide-results></div>
      <template data-guide-empty><div class="t-empty"><p>Aucune machine du catalogue n’atteint ce rendement pour ce type de surface.</p><p>Augmentez le temps disponible, ou <a class="t-link" href="${ctx.link('contact.html')}">demandez un conseil</a>.</p></div></template>
    </div>
  </section>
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true });
}

export function renderStone(ctx) {
  const pg = ctx.data.pages['guide-pierre'];
  const machines = ctx.data.site.stoneMachines.map((s) => productBySlug(ctx.data, s)).filter(Boolean);
  const body = html`
  ${pageHead(ctx, { label: 'Guide · 7 passages', h1: pg.h1, lead: pg.intro })}
  <div class="t-wrap">${strip(ctx, STONE_SET)}</div>
  <section class="t-section" aria-label="Étapes">
    <ol class="t-steps">${ctx.data.site.stoneSteps.map((s) => html`<li class="t-stepr" data-pass><div class="t-wrap t-stepr__in"><span class="t-stepr__n">${pad(s.n)}</span><h2 class="t-stepr__t">${s.title}</h2><p>${fr(s.text)}</p></div></li>`)}</ol>
  </section>
  <section class="t-section t-mistsec" aria-labelledby="mach">
    <div class="t-wrap">${eyebrow(null, 'Machines associées')}<h2 id="mach" class="t-h2" data-dry>Les machines de la méthode.</h2><div class="t-grid t-pp__rel">${machines.map((p) => productCard(ctx, p, figsOf(p)))}</div></div>
  </section>
  ${cta(ctx, { title: 'Un sol à rénover ?', text: 'Décrivez la surface, la nature de la pierre et son état : nous vous orientons vers les machines et les étapes adaptées.' })}`;
  return layout(ctx, body, { data: true });
}

export function renderAbout(ctx) {
  const b = ctx.data.brand;
  const c = ctx.data.site.contact;
  const body = html`
  ${pageHead(ctx, { label: `À propos · ${b.tagline}`, h1: b.headline, lead: fr(b.intro) })}
  <div class="t-wrap">${strip(ctx, ABOUT_SET)}</div>
  <section class="t-section" aria-labelledby="obj"><div class="t-wrap t-split t-split--top">
    <div>${eyebrow(1, 'Notre objectif')}<h2 id="obj" class="t-h3" data-dry>Le partenaire de confiance du nettoyage.</h2></div>
    <div class="t-prose"><p class="t-lead" data-fog>${fr(b.mission)}</p><p data-fog>${fr(b.summary)}</p><p data-fog>${fr(b.closing)}</p></div>
  </div></section>
  <section class="t-section t-values" aria-labelledby="val"><div class="t-wrap">${eyebrow(2, 'Engagements')}<h2 id="val" class="sr">Sept engagements</h2>
    <ol class="t-values__list">${b.values.map((v, i) => html`<li class="t-value${i % 2 ? ' t-value--r' : ''}" data-fog><span class="t-mono">${pad(i + 1)}</span><h3 class="t-value__t">${v.title}</h3><p>${fr(v.text)}</p></li>`)}</ol>
  </div></section>
  <section class="t-section t-mistsec" aria-labelledby="gar"><div class="t-wrap t-split t-split--top">
    <div>${eyebrow(3, 'Garantie & SAV')}<h2 id="gar" class="t-h3" data-dry>Une garantie propre à chaque machine.</h2></div>
    <div class="t-prose"><p class="t-lead" data-fog>${fr(ctx.data.site.guarantee)}</p>
      <dl class="t-kv" data-fog><div><dt class="t-mono">Service client</dt><dd>${c.phone}</dd></div><div><dt class="t-mono">E-mail</dt><dd>${c.email}</dd></div><div><dt class="t-mono">Horaires</dt><dd>${c.hours}</dd></div></dl>
      <div data-fog>${button(ctx.link('contact.html'), 'Contacter GRILLOO')}</div></div>
  </div></section>
  ${cta(ctx)}`;
  return layout(ctx, body);
}

export function renderContact(ctx) {
  const pg = ctx.data.pages.contact;
  const c = ctx.data.site.contact;
  const floors = ['Carrelage', 'Béton', 'Marbre / pierre', 'Résine', 'PVC / vinyle', 'Moquette / textile', 'Extérieur / voirie', 'Autre'];
  const f = (name, label, attrs = '', type = 'text') => html`<label class="t-field"><span>${label}</span><input name="${name}" id="f-${name}" type="${type}" ${raw(attrs)}></label>`;
  const body = html`
  ${pageHead(ctx, { label: 'Contact · devis, présentation, SAV', h1: pg.h1, lead: pg.intro })}
  <section class="t-section t-contact" aria-label="Formulaire"><div class="t-wrap t-contact__grid">
    <form class="t-form" name="devis" method="POST" action="${ctx.link('contact.html')}" data-contact data-mailto="${c.mailto}" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="devis"><p class="sr"><label>Ne pas remplir <input name="bot-field"></label></p>
      <p class="t-mono">01 — Votre besoin</p>
      <div class="t-form__row">
        <label class="t-field"><span>Type de demande</span><select name="type" id="f-type"><option>Devis</option><option>Présentation d’une machine</option><option>Information produit</option><option>SAV / pièces</option></select></label>
        <label class="t-field"><span>Machine</span><select name="machine" id="f-machine"><option value="">Je ne sais pas encore</option>${ctx.data.gammes.map((g) => html`<optgroup label="${g.name}">${ctx.data.products.filter((p) => p.gamme === g.slug).map((p) => html`<option value="${p.slug}">${p.name} — ${p.kind}</option>`)}</optgroup>`)}</select></label>
      </div>
      <div class="t-form__row t-form__row--3">
        ${f('surface', 'Surface (m²)', 'min="1" inputmode="numeric"', 'number')}
        <label class="t-field"><span>Type de sol</span><select name="sol" id="f-sol"><option value="">—</option>${floors.map((x) => html`<option>${x}</option>`)}</select></label>
        <label class="t-field"><span>Secteur</span><select name="secteur" id="f-secteur"><option value="">—</option>${ctx.data.sectors.map((s) => html`<option>${s.name}</option>`)}<option>Autre</option></select></label>
      </div>
      <p class="t-mono">02 — Vos coordonnées</p>
      <div class="t-form__row">${f('nom', 'Nom et prénom *', 'required autocomplete="name"')}${f('societe', 'Société *', 'required autocomplete="organization"')}</div>
      <div class="t-form__row t-form__row--3">${f('fonction', 'Fonction', 'autocomplete="organization-title"')}${f('ville', 'Ville', 'autocomplete="address-level2"')}${f('telephone', 'Téléphone *', 'required autocomplete="tel"', 'tel')}</div>
      ${f('email', 'E-mail *', 'required autocomplete="email"', 'email')}
      <label class="t-field"><span>Message</span><textarea name="message" id="f-message" rows="4"></textarea></label>
      <label class="t-consent"><input type="checkbox" name="consentement" required> J’accepte que GRILLOO utilise ces informations pour répondre à ma demande. *</label>
      <div class="t-actions"><button class="t-btn t-btn--ink" type="submit"><span class="t-btn__txt">Envoyer la demande</span>${icon('arrow', 't-btn__ico')}<span class="t-btn__drop" aria-hidden="true"></span></button><p class="t-mono t-ok" data-contact-ok hidden>Votre messagerie s’ouvre avec la demande pré-remplie.</p></div>
    </form>
    <aside class="t-contact__aside">
      <div class="t-floorcard"><p class="t-mono">Coordonnées</p><dl class="t-kv"><div><dt class="t-mono">Adresse</dt><dd>${c.address}</dd></div><div><dt class="t-mono">Téléphone</dt><dd>${c.phone}</dd></div><div><dt class="t-mono">E-mail</dt><dd>${c.email}</dd></div><div><dt class="t-mono">Horaires</dt><dd>${c.hours}</dd></div></dl></div>
      <div class="t-floorcard"><p class="t-mono">Catalogue 2024</p><p class="t-body">Les 75 fiches techniques en un seul document.</p>${button(ctx.asset('catalogue-grilloo-2024.pdf'), 'Télécharger le PDF', { variant: 'line', iconName: 'download', attrs: 'download' })}</div>
    </aside>
  </div></section>`;
  return layout(ctx, body, { page: 'contact' });
}
