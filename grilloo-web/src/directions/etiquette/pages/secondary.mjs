// Étiquette — Secteurs, Guide de choix, Guide pierre, À propos, Contact.
import { html, raw } from '../../../lib/html.mjs';
import { sectorsModel, keyFigures } from '../../../lib/view-models.mjs';
import { productBySlug } from '../../../lib/data.mjs';
import { fr, ENERGY_LABEL } from '../../../lib/format.mjs';
import { NOTE } from '../../../lib/guide.mjs';
import { layout } from '../layout.mjs';
import { breadcrumbs, cartel, tag, button, genImg, productCard, ctaCoupon, notchRule, mosaic } from '../components.mjs';
import { SECTOR_SET, STONE_SET, ABOUT_SET } from '../../../lib/media.mjs';
import { icon } from '../icons.mjs';

const pad = (n) => String(n).padStart(2, '0');

function pageHead(ctx, { label, extra = '', h1, lead }) {
  return html`<section class="e-pagehead" aria-labelledby="h1">
    <div class="e-wrap">
      ${breadcrumbs(ctx)}
      ${cartel(null, label, extra)}
      <h1 id="h1" class="e-h1" data-split>${h1}</h1>
      ${lead ? html`<p class="e-lead" data-reveal>${fr(lead)}</p>` : ''}
    </div>
  </section>`;
}

// ---------------------------------------------------------------- Secteurs
export function renderSecteurs(ctx) {
  const pg = ctx.data.pages.secteurs;
  const sectors = sectorsModel(ctx.data);
  const body = html`
  ${pageHead(ctx, { label: 'Secteurs', extra: `${sectors.length} environnements`, h1: pg.h1, lead: pg.intro })}
  <nav class="e-anchors" aria-label="Secteurs"><div class="e-wrap e-anchors__in">${sectors.map((s, i) => html`<a href="#${s.slug}"><span>${pad(i + 1)}</span>${s.name}</a>`)}</div></nav>
  ${sectors.map((s, i) => html`<section class="e-section e-sec" id="${s.slug}" aria-labelledby="s-${s.slug}">
    <div class="e-wrap">
      <div class="e-sec__head">
        <div class="e-sec__text">
          <div class="e-sec__meta"><span class="e-sec__idx">${pad(i + 1)}</span>${icon(s.slug)}<span class="e-label">${s.products.length} machines</span></div>
          <h2 id="s-${s.slug}" class="e-h2" data-split>${s.name}</h2>
          <p class="e-lead" data-reveal>${fr(s.intro)}</p>
        </div>
        <div class="e-sec__img">${mosaic(ctx, SECTOR_SET[s.slug], { caption: s.name })}</div>
      </div>
      <div class="e-grid e-sec__grid">${s.products.slice(0, 8).map((p) => productCard(ctx, p, keyFigures(p, 3)))}</div>
      ${s.products.length > 8 ? html`<p class="e-sec__more">+ ${s.products.length - 8} autres machines : <a class="e-link" href="${ctx.link('catalogue.html')}">voir le catalogue ${icon('arrow', 'e-link__ico')}</a></p>` : ''}
    </div>
  </section>`)}
  ${ctaCoupon(ctx)}`;
  return layout(ctx, body, { data: true });
}

// ---------------------------------------------------------------- Guide de choix
export function renderGuide(ctx) {
  const pg = ctx.data.pages.guide;
  const types = [['dur', 'Sol dur', 'Carrelage, béton, marbre, résine'], ['textile', 'Moquette & textiles', 'Moquettes, tapis, sièges'], ['exterieur', 'Extérieur & voirie', 'Parkings, cours, rues'], ['escalator', 'Escalators', 'Escaliers et tapis roulants']];
  const energies = ['batterie', 'secteur', 'manuel'];
  const body = html`
  ${pageHead(ctx, { label: 'Guide de choix', extra: 'Estimation indicative', h1: pg.h1, lead: pg.intro })}
  <section class="e-section e-guide" aria-label="Guide">
    <div class="e-wrap e-guide__grid">
      <form class="e-guide__form" data-guide>
        <fieldset class="e-q">
          <legend><span class="e-q__n">01</span> Quelle surface ?</legend>
          <div class="e-radios">${types.map(([v, l, d], i) => html`<label class="e-radio"><input type="radio" name="surfaceType" value="${v}" ${raw(i === 0 ? 'checked' : '')}><span class="e-radio__box">${icon(v)}<b>${l}</b><small>${d}</small></span></label>`)}</div>
        </fieldset>
        <fieldset class="e-q e-q--row">
          <legend><span class="e-q__n">02</span> Combien, en combien de temps ?</legend>
          <label class="e-num"><span class="e-label">Surface à nettoyer</span><span class="e-num__in"><input type="number" name="area" min="1" step="50" value="2000" inputmode="numeric"><small>m²</small></span></label>
          <label class="e-num"><span class="e-label">Temps disponible par passage</span><span class="e-num__in"><input type="number" name="hours" min="0.5" step="0.5" value="1" inputmode="decimal"><small>h</small></span></label>
        </fieldset>
        <fieldset class="e-q">
          <legend><span class="e-q__n">03</span> Contraintes</legend>
          <label class="e-field e-field--block"><span class="e-label">Énergie</span><select name="energy"><option value="indifferent">Indifférent</option>${energies.map((e) => html`<option value="${e}">${ENERGY_LABEL[e]}</option>`)}</select></label>
          <label class="e-check"><input type="checkbox" name="cluttered"><span></span>Espaces encombrés ou étroits (privilégier les machines compactes)</label>
        </fieldset>
      </form>
      <div class="e-guide__out" aria-live="polite">
        <div class="e-guide__need"><span class="e-label">Rendement nécessaire</span><p><b data-guide-needed>2 000</b><small>m²/h</small></p><p class="e-guide__note">${NOTE}</p></div>
        <div class="e-grid e-grid--2" data-guide-results></div>
        <template data-guide-empty><div class="e-guide__empty"><p>Aucune machine du catalogue n’atteint ce rendement pour ce type de surface.</p><p>Augmentez le temps disponible, ou décrivez votre besoin : <a class="e-link" href="${ctx.link('contact.html')}">demander un conseil ${icon('arrow', 'e-link__ico')}</a></p></div></template>
      </div>
    </div>
  </section>
  ${ctaCoupon(ctx)}`;
  return layout(ctx, body, { data: true });
}

// ---------------------------------------------------------------- Guide pierre
export function renderStone(ctx) {
  const pg = ctx.data.pages['guide-pierre'];
  const machines = ctx.data.site.stoneMachines.map((s) => productBySlug(ctx.data, s)).filter(Boolean);
  const body = html`
  ${pageHead(ctx, { label: 'Guide', extra: '7 étapes', h1: pg.h1, lead: pg.intro })}
  <div class="e-wrap">${mosaic(ctx, STONE_SET, { caption: 'Pierre polie, brossage' })}</div>
  <section class="e-section" aria-labelledby="steps-title">
    <div class="e-wrap e-steps__grid">
      <div class="e-steps__head">${cartel(1, 'Méthode')}<h2 id="steps-title" class="e-h2" data-split>Du meulage à la brillance.</h2><p class="e-body" data-reveal>Méthode décrite dans le catalogue GRILLOO 2024 pour l’usage du durcisseur et de la crème de polissage.</p></div>
      <ol class="e-steps" data-steps>
        <span class="e-steps__line" data-steps-line aria-hidden="true"></span>
        ${ctx.data.site.stoneSteps.map((s) => html`<li class="e-step" data-reveal><span class="e-step__n">${pad(s.n)}</span><div><h3 class="e-step__t">${s.title}</h3><p>${fr(s.text)}</p></div></li>`)}
      </ol>
    </div>
  </section>
  <section class="e-section" aria-labelledby="mach-title">
    <div class="e-wrap">
      ${cartel(2, 'Machines associées')}
      <h2 id="mach-title" class="e-h2" data-split>Les machines de la méthode.</h2>
      <div class="e-grid e-steps__machines">${machines.map((p) => productCard(ctx, p, keyFigures(p, 3)))}</div>
    </div>
  </section>
  ${ctaCoupon(ctx, { title: 'Un sol à rénover ?', text: 'Décrivez la surface, la nature de la pierre et son état : nous vous orientons vers les machines et les étapes adaptées.' })}`;
  return layout(ctx, body, { data: true });
}

// ---------------------------------------------------------------- À propos
export function renderAbout(ctx) {
  const b = ctx.data.brand;
  const c = ctx.data.site.contact;
  const body = html`
  ${pageHead(ctx, { label: 'À propos', extra: b.tagline, h1: b.headline, lead: b.intro })}
  <div class="e-wrap">${mosaic(ctx, ABOUT_SET, { caption: 'Espaces publics, hôtellerie, logistique' })}</div>
  <section class="e-section" aria-labelledby="obj-title">
    <div class="e-wrap e-about__obj">
      <div>${cartel(1, 'Notre objectif')}<h2 id="obj-title" class="e-h2" data-split>Le partenaire de confiance du nettoyage.</h2></div>
      <div class="e-about__prose"><p class="e-lead" data-reveal>${fr(b.mission)}</p><p class="e-body" data-reveal>${fr(b.summary)}</p><p class="e-body" data-reveal>${fr(b.closing)}</p></div>
    </div>
  </section>
  <section class="e-section e-values" aria-labelledby="values-title">
    <div class="e-wrap e-values__grid">
      <div class="e-values__head">${cartel(2, 'Engagements')}<h2 id="values-title" class="e-h2" data-split>Sept engagements.</h2></div>
      <ol class="e-values__list">${b.values.map((v, i) => html`<li class="e-value" data-reveal><span class="e-value__idx">${pad(i + 1)}</span><h3 class="e-value__title">${v.title}</h3><p>${fr(v.text)}</p></li>`)}</ol>
    </div>
  </section>
  <section class="e-section e-sheet" aria-labelledby="gar-title">
    <div class="e-sheet__tab"><span>03</span> Garantie</div>
    <div class="e-wrap e-about__obj">
      <div>${tag('Garantie & SAV')}<h2 id="gar-title" class="e-h2" data-split>Une garantie propre à chaque machine.</h2></div>
      <div class="e-about__prose">
        <p class="e-lead" data-reveal>${fr(ctx.data.site.guarantee)}</p>
        <dl class="e-kv" data-reveal>
          <div><dt>Service client</dt><dd>${c.phone}</dd></div>
          <div><dt>E-mail</dt><dd>${c.email}</dd></div>
          <div><dt>Horaires</dt><dd>${c.hours}</dd></div>
        </dl>
        ${button(ctx.link('contact.html'), 'Contacter GRILLOO')}
      </div>
    </div>
  </section>
  ${ctaCoupon(ctx)}`;
  return layout(ctx, body);
}

// ---------------------------------------------------------------- Contact
export function renderContact(ctx) {
  const pg = ctx.data.pages.contact;
  const c = ctx.data.site.contact;
  const floors = ['Carrelage', 'Béton', 'Marbre / pierre', 'Résine', 'PVC / vinyle', 'Moquette / textile', 'Extérieur / voirie', 'Autre'];
  const body = html`
  ${pageHead(ctx, { label: 'Contact', extra: 'Devis · Présentation · SAV', h1: pg.h1, lead: pg.intro })}
  <section class="e-section e-contact" aria-label="Formulaire">
    <div class="e-wrap e-contact__grid">
      <form class="e-form" name="devis" method="POST" action="${ctx.link('contact.html')}" data-contact data-mailto="${c.mailto}" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="devis">
        <p class="sr"><label>Ne pas remplir <input name="bot-field"></label></p>
        <fieldset class="e-form__set"><legend class="e-label">01 — Votre besoin</legend>
          <div class="e-form__row">
            <label class="e-in"><span>Type de demande</span><select name="type" id="f-type" required><option value="Devis">Devis</option><option value="Présentation">Présentation d’une machine</option><option value="Information">Information produit</option><option value="SAV">SAV / pièces</option></select></label>
            <label class="e-in"><span>Machine</span><select name="machine" id="f-machine"><option value="">Je ne sais pas encore</option>${ctx.data.gammes.map((g) => html`<optgroup label="${g.name}">${ctx.data.products.filter((p) => p.gamme === g.slug).map((p) => html`<option value="${p.slug}">${p.name} — ${p.kind}</option>`)}</optgroup>`)}</select></label>
          </div>
          <div class="e-form__row e-form__row--3">
            <label class="e-in"><span>Surface (m²)</span><input name="surface" id="f-surface" type="number" min="1" inputmode="numeric"></label>
            <label class="e-in"><span>Type de sol</span><select name="sol" id="f-sol"><option value="">—</option>${floors.map((f) => html`<option>${f}</option>`)}</select></label>
            <label class="e-in"><span>Secteur</span><select name="secteur" id="f-secteur"><option value="">—</option>${ctx.data.sectors.map((s) => html`<option>${s.name}</option>`)}<option>Autre</option></select></label>
          </div>
        </fieldset>
        <fieldset class="e-form__set"><legend class="e-label">02 — Vos coordonnées</legend>
          <div class="e-form__row">
            <label class="e-in"><span>Nom et prénom *</span><input name="nom" id="f-nom" required autocomplete="name"></label>
            <label class="e-in"><span>Société *</span><input name="societe" id="f-societe" required autocomplete="organization"></label>
          </div>
          <div class="e-form__row e-form__row--3">
            <label class="e-in"><span>Fonction</span><input name="fonction" id="f-fonction" autocomplete="organization-title"></label>
            <label class="e-in"><span>Ville</span><input name="ville" id="f-ville" autocomplete="address-level2"></label>
            <label class="e-in"><span>Téléphone *</span><input name="telephone" id="f-tel" type="tel" required autocomplete="tel"></label>
          </div>
          <label class="e-in"><span>E-mail *</span><input name="email" id="f-email" type="email" required autocomplete="email"></label>
          <label class="e-in"><span>Message</span><textarea name="message" id="f-msg" rows="4"></textarea></label>
          <label class="e-check"><input type="checkbox" name="consentement" required><span></span>J’accepte que GRILLOO utilise ces informations pour répondre à ma demande. *</label>
        </fieldset>
        <div class="e-form__submit"><button class="e-btn e-btn--ink" type="submit"><span class="e-btn__txt">Envoyer la demande</span>${icon('arrow', 'e-btn__ico')}</button><p class="e-form__ok" data-contact-ok hidden>Votre messagerie s’ouvre avec la demande pré-remplie.</p></div>
      </form>
      <aside class="e-contact__aside">
        <div class="e-contact__card">${tag('Coordonnées')}
          <dl class="e-kv">
            <div><dt>Adresse</dt><dd>${c.address}</dd></div>
            <div><dt>Téléphone</dt><dd>${c.phone}</dd></div>
            <div><dt>E-mail</dt><dd>${c.email}</dd></div>
            <div><dt>Horaires</dt><dd>${c.hours}</dd></div>
          </dl>
        </div>
        ${notchRule('30%')}
        <div class="e-contact__card">${tag('Catalogue 2024')}<p class="e-body">Les 75 fiches techniques en un seul document.</p>${button(ctx.asset('catalogue-grilloo-2024.pdf'), 'Télécharger le PDF (11 Mo)', { variant: 'line', iconName: 'download', attrs: 'download' })}</div>
      </aside>
    </div>
  </section>`;
  return layout(ctx, body, { page: 'contact' });
}
