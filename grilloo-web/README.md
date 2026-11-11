# GRILLOO — site catalogue, 3 directions

Trois directions visuelles « White Premium » du site catalogue GRILLOO, chacune sur les 15 pages prévues (14 pages + 75 fiches produit = 89 pages par direction) :

| Direction | Idée | Typographie |
|---|---|---|
| **Étiquette** | Le cartel de précision : codes du catalogue imprimé, filets, rigueur suisse | Host Grotesk + Barlow Condensed |
| **Trace** | Le reflet et la buée : sols clairs que le curseur et le défilement nettoient | Hanken Grotesk + JetBrains Mono |
| **Rondeur** | L’orbite : les « oo » du logo deviennent des disques, hublots et cercles | Unbounded + Inter Tight |

Spec : `../docs/superpowers/specs/2026-11-10-grilloo-web-3-directions-design.md`

## Ouvrir en local (sans serveur)

Double-cliquez sur **`dist/index.html`** : la page de choix présente les trois directions et ouvre chacune d’elles. Tout fonctionne en `file://` (scripts classiques, chemins relatifs, polices et bibliothèques embarquées).

## Reconstruire

Node 18+ (Node portable installé dans `%LOCALAPPDATA%\nodejs-portable`).

```bash
npm install
npm run build                 # les 3 directions + page de choix → dist/
node src/build.mjs trace      # une seule direction (les autres restent dans dist/)
npm test                      # 81 tests : données, guide de choix, filtres, SEO, liens, garde-fous
node scripts/check-links.mjs dist
```

## Déployer (Netlify ou Vercel)

`dist/` est un site statique complet.

- **Netlify** : glisser-déposer `dist/` sur app.netlify.com/drop, ou `netlify deploy --dir=dist --prod`. Le formulaire de devis (`data-netlify="true"`, nom `devis`) est alors actif automatiquement.
- **Vercel** : `vercel deploy dist --prod`. Sur Vercel, brancher le formulaire sur un service (Formspree, etc.) : en attendant, il ouvre la messagerie avec la demande pré-remplie (comportement actuel en local).

Pour mettre en ligne **la direction retenue seule**, déployer `dist/<direction>/`.

### Passer la direction retenue en indexable

Les maquettes sont en `noindex` et `robots.txt` bloque tout. Pour la mise en ligne :

1. `src/lib/seo.mjs` → `export const INDEXABLE = true;` (active `index, follow`, la balise canonical et le `robots.txt` ouvert avec le sitemap) ;
2. vérifier `data/site.json` → `domain` (`https://www.grilloo.net`) ;
3. `node src/build.mjs <direction>` puis déployer `dist/<direction>/`.

## Contenus à fournir par GRILLOO

Tout ce qui est inconnu apparaît « À fournir par GRILLOO » et se modifie dans **`data/site.json`** : adresse, téléphone, e-mail, horaires, numéro WhatsApp, liens des réseaux sociaux, e-mail de réception des devis (`contact.mailto`).

**Photos HD des machines.** Les visuels produits sont les détourages du catalogue PDF (environ 600 px, qualité inégale). À demander en priorité, en fond blanc, plus de 2 000 px :
- G01M et G02M (réservoir blanc peu lisible sur fond blanc), RoboClean G+, G9, G53, G120 ;
- une photo par machine pour les 75 fiches ; les remplacer dans `assets/img/cut/<slug>.webp`, même nom de fichier.

**Points à confirmer dans le catalogue.** Voir `../directions/shared/data-issues.md` : incohérences texte / tableau, mentions de tiers retirées, allégations à justifier (brevets, ATEX, EN IEC 63327, garantie batterie 5 ans), conditions réelles de garantie.

## Règles de contenu appliquées

- Rien d’inventé : chiffres et textes issus du catalogue 2024 ; quand le texte d’une fiche contredit son tableau, c’est le tableau qui fait foi (`scripts/prepare-data.mjs`).
- Pas d’avis clients, pas de références fictives, pas de promesse de délai ou de démonstration gratuite.
- Les images d’ambiance (`assets/img/gen/`) sont générées (GPT image) et signalées « Illustration » ; elles ne représentent jamais une machine GRILLOO.

## Structure

```
data/           catalog.json (75 fiches nettoyées), gammes, secteurs, site, pages, brand
src/build.mjs   générateur ; src/chooser.mjs page de choix
src/lib/        données, routes, SEO/JSON-LD, guide de choix, filtres, modèles de vue
src/client/     scripts navigateur partagés (animations, catalogue, comparateur, guide, devis)
src/directions/ etiquette/ · trace/ · rondeur/ (gabarits, CSS, JS propres à chaque direction)
assets/         détourages WebP, logos, visuels générés, PDF
scripts/        prepare-data, gen-images (+ prompts.json), check-links, captures (shot.ps1, seg.ps1)
```

Régénérer un visuel : `OPENAI_API_KEY=… node scripts/gen-images.mjs --only amb-hotel --force`.
