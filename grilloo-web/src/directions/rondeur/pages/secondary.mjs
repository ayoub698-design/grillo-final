// Rondeur — Secteurs, Guide de choix, Guide pierre, À propos, Contact.
import { html, raw } from '../../../lib/html.mjs';
import { sectorsModel, keyFigures } from '../../../lib/view-models.mjs';
import { productBySlug } from '../../../lib/data.mjs';
import { fr, ENERGY_LABEL } from '../../../lib/format.mjs';
import { NOTE } from '../../../lib/guide.mjs';
import { layout } from '../layout.mjs';
import { pageHead, kicker, button, icon, genImg, productCard, cta, circleChain, cluster } from '../components.mjs';
import { SECTOR_SET, STONE_SET, ABOUT_SET } from '../../../lib/media.mjs';

const pad = (n) => String(n).padStart(2, '0');
const figs3 = (p) => keyFigures(p, 3);

export function renderSecteurs(ctx) {
  const pg = ctx.data.pages.secteurs;
  const sectors = sectorsModel(ctx.data);
  const body = html`
  ${pageHead(ctx, { label: 'Secteurs', h1: pg.h1, lead: pg.intro, extra: html`<nav class="r-chips" style="margin-top:36px" aria-label="Secteurs">${sectors.map((s) => html`<a class="r-tag" href="#${s.slug}">${s.name}</a>`)}</nav>` })}
  ${sectors.map((s, i) => html`<section class="r-section r-sector-sec${i % 2 ? ' r-foam' : ''}" id="${s.slug}" aria-labelledby="s-${s.slug}"><div class="r-wrap">
    <div class="r-alt${i % 2 ? ' r-alt--r' : ''}">
      <div class="r-alt__cl">${cluster(ctx, SECTOR_SET[s.slug])}</div>
      <div class="r-alt__text">${kicker(i + 1, `${s.products.length} machines`)}<h2 id="s-${s.slug}" class="r-h3" data-rise>${s.name}</h2><p class="r-lead" data-pop>${fr(s.intro)}</p></div>
    </div>
    <div class="r-grid">${s.products.slice(0, 6).map((p) => productCard(ctx, p, figs3(p)))}</div>
    ${s.products.length > 6 ? html`<div class="r-center" style="margin-top:48px"><a class="r-link" href="${ctx.link('catalogue.html')}">+ ${s.products.length - 6} autres machines dans le catalogue</a></div>` : ''}
  </div></section>`)}
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true });
}

export function renderGuide(ctx) {
  const pg = ctx.data.pages.guide;
  const types = [['dur', 'Sol dur'], ['textile', 'Moquette & textiles'], ['exterieur', 'Extérieur & voirie'], ['escalator', 'Escalators']];
  const body = html`
  ${pageHead(ctx, { label: 'Guide de choix · estimation indicative', h1: pg.h1, lead: pg.intro })}
  <form class="r-wrap r-guide" data-guide>
    <fieldset class="r-q"><legend><span>01</span>Quelle surface ?</legend>
      <div class="r-chips">${types.map(([v, l], i) => html`<label class="r-chip"><input type="radio" name="surfaceType" value="${v}" ${raw(i === 0 ? 'checked' : '')}><span>${icon(v)}${l}</span></label>`)}</div>
    </fieldset>
    <fieldset class="r-q"><legend><span>02</span>Combien, en combien de temps ?</legend>
      <div class="r-nums">
        <label class="r-num"><input type="number" name="area" min="1" step="50" value="2000" inputmode="numeric" aria-label="Surface à nettoyer en m²"><small>m² à nettoyer</small></label>
        <label class="r-num"><input type="number" name="hours" min="0.5" step="0.5" value="1" inputmode="decimal" aria-label="Temps disponible en heures"><small>heure(s) disponible(s)</small></label>
      </div>
    </fieldset>
    <fieldset class="r-q"><legend><span>03</span>Des contraintes ?</legend>
      <div class="r-chips">
        <label class="r-chip"><input type="radio" name="energy" value="indifferent" checked><span>Énergie indifférente</span></label>
        ${['batterie', 'secteur', 'manuel'].map((e) => html`<label class="r-chip"><input type="radio" name="energy" value="${e}"><span>${ENERGY_LABEL[e]}</span></label>`)}
        <label class="r-chip"><input type="checkbox" name="cluttered"><span>Espaces encombrés</span></label>
      </div>
    </fieldset>
  </form>
  <section class="r-section" aria-live="polite" aria-label="Résultat" style="padding-top:0">
    <div class="r-wrap">
      ${circleChain()}
      <div class="r-result" data-pop><div class="r-result__disc"><small>Rendement nécessaire</small><b data-guide-needed>2 000</b><small>m² / heure</small></div><p class="r-note">${NOTE}</p></div>
      <div class="r-grid r-results" data-guide-results></div>
      <template data-guide-empty><div class="r-empty"><p>Aucune machine du catalogue n’atteint ce rendement pour ce type de surface.</p><p>Augmentez le temps disponible, ou <a class="r-link" href="${ctx.link('contact.html')}">demandez un conseil</a>.</p></div></template>
    </div>
  </section>
  ${cta(ctx)}`;
  return layout(ctx, body, { data: true });
}

export function renderStone(ctx) {
  const pg = ctx.data.pages['guide-pierre'];
  const machines = ctx.data.site.stoneMachines.map((s) => productBySlug(ctx.data, s)).filter(Boolean);
  const body = html`
  ${pageHead(ctx, { label: 'Guide · 7 étapes', h1: pg.h1, lead: pg.intro })}
  <div class="r-wrap">${cluster(ctx, STONE_SET, { cls: 'r-cluster--wide' })}</div>
  <section class="r-section" aria-label="Étapes"><ol class="r-vsteps r-wrap">${ctx.data.site.stoneSteps.map((s) => html`<li class="r-vstep" data-pop><span class="r-vstep__n">${s.n}</span><div><h2>${s.title}</h2><p>${fr(s.text)}</p></div></li>`)}</ol></section>
  <section class="r-section r-foam" aria-labelledby="mach"><div class="r-wrap">
    <div class="r-sec__head">${kicker(null, 'Machines associées')}<h2 id="mach" class="r-h2" data-rise>Les machines de la méthode.</h2></div>
    <div class="r-grid">${machines.map((p) => productCard(ctx, p, figs3(p)))}</div>
  </div></section>
  ${cta(ctx, { title: 'Un sol à rénover ?', text: 'Décrivez la surface, la nature de la pierre et son état.' })}`;
  return layout(ctx, body, { data: true });
}

export function renderAbout(ctx) {
  const b = ctx.data.brand;
  const c = ctx.data.site.contact;
  const body = html`
  ${pageHead(ctx, { label: b.tagline, h1: b.headline, lead: fr(b.intro) })}
  <div class="r-wrap">${cluster(ctx, ABOUT_SET, { cls: 'r-cluster--wide' })}</div>
  <section class="r-section" aria-labelledby="obj"><div class="r-wrap"><div class="r-col r-center">
    ${kicker(1, 'Notre objectif')}<h2 id="obj" class="r-h2" data-rise>Le partenaire de confiance du nettoyage.</h2>
    <p class="r-lead" data-pop>${fr(b.mission)}</p><p class="r-body" data-pop style="margin-top:16px">${fr(b.summary)}</p>
  </div></div></section>
  <section class="r-section r-values" aria-labelledby="val">
    ${circleChain()}
    <div class="r-wrap r-center">${kicker(2, 'Engagements')}<h2 id="val" class="r-h2" data-rise>Sept engagements.</h2></div>
    <ol class="r-wrap r-pastilles">${b.values.map((v, i) => html`<li class="r-pastille" data-pop><span class="r-pastille__n">${pad(i + 1)}</span><h3>${v.title}</h3><p>${fr(v.text)}</p></li>`)}</ol>
  </section>
  <section class="r-section r-foam" aria-labelledby="gar"><div class="r-wrap"><div class="r-col r-center">
    ${kicker(3, 'Garantie & SAV')}<h2 id="gar" class="r-h2" data-rise>Une garantie propre à chaque machine.</h2>
    <p class="r-lead" data-pop>${fr(ctx.data.site.guarantee)}</p>
    <dl class="r-kv" data-pop style="margin-top:32px"><div><dt>Service client</dt><dd>${c.phone}</dd></div><div><dt>E-mail</dt><dd>${c.email}</dd></div><div><dt>Horaires</dt><dd>${c.hours}</dd></div></dl>
    <div data-pop style="margin-top:32px">${button(ctx.link('contact.html'), 'Contacter GRILLOO')}</div>
  </div></div></section>
  ${cta(ctx)}`;
  return layout(ctx, body);
}

export function renderContact(ctx) {
  const pg = ctx.data.pages.contact;
  const c = ctx.data.site.contact;
  const floors = ['Carrelage', 'Béton', 'Marbre / pierre', 'Résine', 'PVC / vinyle', 'Moquette / textile', 'Extérieur / voirie', 'Autre'];
  const f = (name, label, attrs = '', type = 'text') => html`<label class="r-field"><span>${label}</span><input name="${name}" id="f-${name}" type="${type}" ${raw(attrs)}></label>`;
  const body = html`
  ${pageHead(ctx, { label: 'Devis · présentation · SAV', h1: pg.h1, lead: pg.intro })}
  <section class="r-section r-contact" aria-label="Formulaire"><div class="r-wrap r-contact__grid">
    <form class="r-form" name="devis" method="POST" action="${ctx.link('contact.html')}" data-contact data-mailto="${c.mailto}" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="devis"><p class="sr"><label>Ne pas remplir <input name="bot-field"></label></p>
      <p class="r-form__t">01 — Votre besoin</p>
      <div class="r-form__row">
        <label class="r-field"><span>Type de demande</span><select name="type" id="f-type"><option>Devis</option><option>Présentation d’une machine</option><option>Information produit</option><option>SAV / pièces</option></select></label>
        <label class="r-field"><span>Machine</span><select name="machine" id="f-machine"><option value="">Je ne sais pas encore</option>${ctx.data.gammes.map((g) => html`<optgroup label="${g.name}">${ctx.data.products.filter((p) => p.gamme === g.slug).map((p) => html`<option value="${p.slug}">${p.name} — ${p.kind}</option>`)}</optgroup>`)}</select></label>
      </div>
      <div class="r-form__row r-form__row--3">
        ${f('surface', 'Surface (m²)', 'min="1" inputmode="numeric"', 'number')}
        <label class="r-field"><span>Type de sol</span><select name="sol" id="f-sol"><option value="">—</option>${floors.map((x) => html`<option>${x}</option>`)}</select></label>
        <label class="r-field"><span>Secteur</span><select name="secteur" id="f-secteur"><option value="">—</option>${ctx.data.sectors.map((s) => html`<option>${s.name}</option>`)}<option>Autre</option></select></label>
      </div>
      <p class="r-form__t">02 — Vos coordonnées</p>
      <div class="r-form__row">${f('nom', 'Nom et prénom *', 'required autocomplete="name"')}${f('societe', 'Société *', 'required autocomplete="organization"')}</div>
      <div class="r-form__row r-form__row--3">${f('fonction', 'Fonction', 'autocomplete="organization-title"')}${f('ville', 'Ville', 'autocomplete="address-level2"')}${f('telephone', 'Téléphone *', 'required autocomplete="tel"', 'tel')}</div>
      ${f('email', 'E-mail *', 'required autocomplete="email"', 'email')}
      <label class="r-field"><span>Message</span><textarea name="message" id="f-message" rows="4"></textarea></label>
      <label class="r-consent"><input type="checkbox" name="consentement" required> J’accepte que GRILLOO utilise ces informations pour répondre à ma demande. *</label>
      <div class="r-pp__actions"><button class="r-btn r-btn--ink" type="submit"><span class="r-btn__txt">Envoyer la demande</span><span class="r-btn__ico">${icon('arrow')}</span></button><p class="r-ok" data-contact-ok hidden>Votre messagerie s’ouvre avec la demande pré-remplie.</p></div>
    </form>
    <aside class="r-aside">
      <div class="r-aside__card"><span class="r-kicker"><span class="r-kicker__dot r-kicker__dot--empty"></span>Coordonnées</span><dl class="r-kv"><div><dt>Adresse</dt><dd>${c.address}</dd></div><div><dt>Téléphone</dt><dd>${c.phone}</dd></div><div><dt>E-mail</dt><dd>${c.email}</dd></div><div><dt>Horaires</dt><dd>${c.hours}</dd></div></dl></div>
      <div class="r-aside__card"><span class="r-kicker"><span class="r-kicker__dot r-kicker__dot--empty"></span>Catalogue 2024</span><p class="r-body">Les 75 fiches techniques en un seul document.</p>${button(ctx.asset('catalogue-grilloo-2024.pdf'), 'Télécharger le PDF', { variant: 'line', iconName: 'download', attrs: 'download' })}</div>
    </aside>
  </div></section>`;
  return layout(ctx, body, { page: 'contact' });
}
