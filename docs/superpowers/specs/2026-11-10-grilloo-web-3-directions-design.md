# GRILLOO — Site catalogue, 3 directions × 15 pages — Spec de conception

Date : 2026-11-10 · Statut : à valider par le client

## 1. Objectif et contexte

GRILLOO (« Leader des solutions de nettoyage ») est un acteur majeur du matériel de nettoyage professionnel au Maroc. Source unique : le catalogue 2024 (75 machines, 10 familles).

Le site catalogue doit :
- **attirer du trafic SEO** : une URL par machine, une page par gamme, des contenus de guide ;
- **servir de point d'arrivée aux campagnes sur les réseaux sociaux** qui ciblent les grandes entreprises (achats, services généraux, sociétés de propreté, facility managers) ;
- **convertir en demande de devis**.

Livrable de cette phase : **3 directions visuelles distinctes dans un standard « White Premium » commun, chacune déclinée sur les 15 pages**, consultables en local (double-clic, `file://`) puis déployables telles quelles sur Netlify ou Vercel.

On repart de zéro : `grilloo-catalogue/`, `directions/`, `grilloo-site/` et `maquettes/` ne sont pas réutilisés comme code. Seule la matière brute est reprise : données des 75 fiches (`catalog-data.json`), détourages produits (`img/cut/`), logos (`img/brand/`), PDF.

## 2. Règles de contenu (non négociables)

1. **Rien d'inventé.** Faits, chiffres et caractéristiques viennent du catalogue. Pas d'avis clients, pas de logos de références, pas de compteurs « +500 clients ».
2. **Le tableau technique fait foi** en cas d'incohérence avec le texte d'une fiche (relevé dans `directions/shared/data-issues.md`, conservé et livré au client).
3. **Mentions de tiers retirées** du texte affiché : « JS Floor Systems », « Home Base », « ROND® », « PW 30/1 », « DT021 », « 510 ventilateur ».
4. **Allégations à justifier** (brevets, EN IEC 63327, ATEX, HEPA H13, garantie batterie 5 ans) : affichées seulement là où le catalogue les donne pour la machine concernée, jamais promues au niveau de la marque.
5. **Coordonnées, adresse, horaires, WhatsApp** : inconnus. Emplacements visibles « À fournir par GRILLOO » centralisés dans `data/site.json`.
6. **Visuels** : les machines sont toujours montrées avec leur vraie photo détourée du catalogue. Les images générées (GPT image) servent aux ambiances, textures, matières et décors. Elles ne redessinent jamais un produit et ne montrent aucun logo de tiers.
7. Langue : **français uniquement**.

## 3. Architecture technique

**Générateur statique maison en Node** (Node portable déjà installé), HTML/CSS/JS vanilla, aucun framework.

```
grilloo-web/
  data/
    catalog.json        ← repris de catalog-data.json, nettoyé (règles 2–4)
    families.json       ← 6 gammes du site + mapping des 10 familles du catalogue
    sectors.json        ← 6 secteurs, machines citées par le catalogue
    site.json           ← coordonnées (placeholders), navigation, textes de marque
    pages.json          ← contenu éditorial partagé des 15 pages (titres, intros, sections)
  src/
    build.mjs           ← génère dist/ : 3 directions × (14 pages + 75 fiches) + page de choix
    lib/                ← helpers (html``, slug, seo/json-ld, chemins relatifs, guide de choix)
    directions/
      etiquette/  { layout.mjs, pages/*.mjs, style.css, main.js }
      trace/      { … }
      rondeur/    { … }
  assets/
    img/{cut,brand,gen}/   fonts/   vendor/{gsap,lenis}/
  scripts/
    gen-images.mjs      ← génération GPT image à partir d'une liste de prompts versionnée
    check-links.mjs     ← vérifie que chaque href/src relatif de dist/ existe
    shot.ps1            ← captures desktop 1440 et mobile 390 (navigateur headless)
  dist/                 ← livrable : index.html (choix) + /etiquette /trace /rondeur
```

- **Contenu partagé, rendu propre à chaque direction.** `pages.json` et les données sont communs. Chaque direction a ses propres gabarits, sa mise en page, ses composants et son mouvement. Ce n'est pas un thème de couleurs sur un même squelette.
- **Chemins relatifs partout**, liens vers des fichiers `.html` : le double-clic fonctionne et le même `dist/` se déploie sans configuration.
- **Bibliothèques copiées en local** (pas de CDN) : GSAP 3 (ScrollTrigger, SplitText, Flip), Lenis. Polices auto-hébergées (woff2 issus de @fontsource).
- **Formulaire de devis** : attributs Netlify Forms (actif une fois déployé sur Netlify) + repli `mailto:` en local. Pré-remplissage de la machine via `?machine=<slug>`.
- **Accessibilité / performance** : contrastes AA, navigation clavier, `prefers-reduced-motion` (toutes les animations désactivables), images en `loading="lazy"` avec dimensions, pas de WebGL (canvas 2D au plus).

### URLs (identiques dans chaque direction)

| # | Page | Fichier |
|---|---|---|
| 1 | Accueil | `index.html` |
| 2 | Catalogue | `catalogue.html` |
| 3 | Fiche produit (×75) | `produits/<slug>.html` |
| 4 | Autolaveuses | `gammes/autolaveuses.html` |
| 5 | Aspirateurs | `gammes/aspirateurs.html` |
| 6 | Balayeuses | `gammes/balayeuses.html` |
| 7 | Traitement des sols | `gammes/traitement-des-sols.html` |
| 8 | Textiles & séchage | `gammes/textiles-sechage.html` |
| 9 | Équipements spécialisés | `gammes/equipements-specialises.html` |
| 10 | RoboClean G+ | `robotclean-g-plus.html` |
| 11 | Secteurs | `secteurs.html` (ancres par secteur) |
| 12 | Guide de choix | `guide-de-choix.html` |
| 13 | Guide : rénover un sol en pierre | `guides/renover-sol-pierre.html` |
| 14 | À propos | `a-propos.html` |
| 15 | Contact / Devis | `contact.html` |

Gammes → familles du catalogue : Autolaveuses = autolaveuses accompagnées + autoportées (RoboClean incluse) · Aspirateurs = aspirateurs pro + industriels/ATEX + aspiro-brosseurs · Balayeuses · Traitement des sols = monobrosses + polisseuses (dont GS-TNE4-E, rangée là par le catalogue) · Textiles & séchage = injecteurs-extracteurs + souffleurs/air chaud · Équipements spécialisés = machines d'escalator, perche télescopique, nettoyeur haute pression, canon à mousse, compresseurs.

### SEO

- `<title>` et meta description uniques par page, H1 unique, fil d'Ariane.
- JSON-LD : `Organization` (accueil), `BreadcrumbList` (toutes), `Product` sans prix (fiches : nom, marque, image, description, `additionalProperty` pour les specs), `HowTo` (guide pierre), `ItemList` (gammes et catalogue).
- Maillage : fiche → gamme → produits voisins → secteurs concernés → guide de choix → devis.
- `sitemap.xml` et `robots.txt` générés. **Les 3 directions portent `noindex`** tant qu'aucune n'est retenue ; la direction choisie passera en `index` avec canonical sur `www.grilloo.net` (domaine imprimé au dos du catalogue).

## 4. Contenu des pages (partagé par les 3 directions)

Chaque direction peut réordonner ou fusionner visuellement, mais toutes portent ce contenu.

1. **Accueil**
   - Hero : promesse de la marque issue du catalogue (« Nettoyez avec Excellence » / « La puissance du nettoyage entre vos mains ») + CTA devis + CTA catalogue.
   - Les 6 gammes, avec la plage réelle de chaque famille (ex. autolaveuses de 1 200 à 12 000 m²/h).
   - RoboClean G+ en avant (autonomie, sécurité ; chiffres du tableau).
   - Teaser du guide de choix (« Quelle surface à nettoyer ? »).
   - Secteurs.
   - Les 7 engagements du catalogue (Innovation, Fiabilité, Facilité d'utilisation, Performance, Durabilité, Expérience, Satisfaction client).
   - Guide pierre en ressource.
   - CTA devis final.
2. **Catalogue** : 75 machines, filtres (gamme, énergie batterie/secteur/manuel/thermique, rendement), recherche, tri, compteur de résultats, ajout au comparateur (2 à 3 machines, tableau des specs communes).
3. **Fiche produit** : photo détourée (+ vue secondaire si elle existe), 3 à 4 chiffres clés, description, points forts, tableau technique complet, accessoires standard et options, variantes (ex. GS60 / GS60+), machines de la même gamme, secteurs, CTA devis pré-rempli, lien vers le PDF.
4. **Pages gammes 4 à 9** : intro de famille (texte du catalogue, p. 3 et p. 26), critères de choix propres à la gamme, liste des machines avec chiffres comparables, mini-comparatif, FAQ courte construite uniquement à partir des données (ex. « Quelle autonomie ? » → plage réelle), CTA.
5. **RoboClean G+** : page vitrine. Mode autonome / manuel, sécurité (capteurs, caméras 3D, ralentissement / arrêt), entretien sans outil, tableau complet, CTA démonstration/devis (formulé « demander une présentation », sans promettre de démo gratuite).
6. **Secteurs** : Santé & établissements médicalisés · Logistique, entrepôts & parkings · Industrie & agroalimentaire · Commerce & surfaces de vente · Hôtellerie & restauration · Collectivités & espaces publics. Chaque secteur montre les machines que le catalogue associe à ce type de lieu.
7. **Guide de choix** (interactif, indicatif) :
   - questions : type de surface (sol dur / textile / extérieur / escalator), surface en m², temps disponible par passage, énergie, lieu encombré ou non ;
   - calcul : m²/h nécessaire = surface ÷ temps, puis filtrage des machines dont le rendement catalogue est suffisant dans les familles compatibles ;
   - résultat : liste des machines avec chiffres, lien vers la fiche, bouton devis. Mention « estimation indicative basée sur les rendements théoriques du catalogue ».
8. **Guide pierre** : les 7 étapes du catalogue (p. 46–47 : meulage #16/#30 → diamants #80–300 → résine #50 → durcisseur → résine #150–500 → #1000–3000 → crème de polissage), machines associées (GP1800, GP1800RP, GP1800RPM, M4, MSC8).
9. **À propos** : texte de marque (p. 3), objectif (p. 4), 7 engagements, garantie (formulée honnêtement : conditions propres à chaque produit, à demander), SAV et coordonnées (placeholders).
10. **Contact / Devis** : formulaire qualifié (type de demande, machine, surface, type de sol, secteur, société, fonction, ville, téléphone, e-mail, message), coordonnées, carte (placeholder), téléchargement du catalogue PDF.

Navigation commune : Gammes (méga-menu 6 gammes) · Catalogue · Secteurs · Guide de choix · RoboClean G+ · À propos · bouton « Demander un devis ». Pied de page : gammes, pages, coordonnées, PDF, réseaux sociaux (liens à fournir).

## 5. Direction artistique

### 5.0 Socle commun « White Premium » (s'applique aux 3 directions)

Identité résolument blanche, lumineuse, minimaliste et élégante. Le produit détouré est le héros, posé sur du blanc. Les trois directions partagent ce standard et diffèrent par la typographie, le rythme et le mouvement.

- **Lumière :** fonds `#FFFFFF` et un seul blanc secondaire par direction. Aucun aplat sombre pleine largeur, aucune section noire. Le cyan GRILLOO est une **ponctuation** (≤ 5 % de la surface d'un écran) : marqueur, état actif, unité, filet, jamais un fond de section.
- **Espace :** grille 8 pt. Sections espacées de 160–240 px en desktop (96–128 px en mobile). Largeur de lecture 60–70 caractères. Marges latérales généreuses (≥ 6 vw en desktop). Une idée par écran.
- **Typographie de précision :**
  - échelle modulaire propre à chaque direction ;
  - interlettrage ajusté par taille (négatif en display, positif en petites capitales) ;
  - chiffres tabulaires (`font-variant-numeric: tabular-nums`) dans les specs ;
  - `text-wrap: balance` sur les titres, `pretty` sur les paragraphes ;
  - espaces fines insécables avant « : ; ! ? » et dans les nombres (1 200 m²/h) ;
  - unités en taille réduite alignées sur la ligne de base.
- **Produits :** détourages sur blanc, ombre de contact douce (ellipse floue, 6–10 % d'opacité), même hauteur optique dans une grille, jamais rognés.
- **Images d'ambiance :** high-key, lumière naturelle abondante, tons clairs, peu de contraste, décors marocains contemporains épurés.
- **Fluidité :**
  - défilement Lenis (lerp 0.09) ;
  - courbes d'accélération sans rebond ; la courbe de référence est `cubic-bezier(0.22, 1, 0.36, 1)` ;
  - une seule propriété animée « lourde » à la fois ;
  - uniquement `transform`, `opacity`, `clip-path` et `filter`, à 60 fps ;
  - aucun élément qui clignote, aucune boucle agressive.
- **Interdits :** dégradés « blob », néons, glassmorphism systématique, compteurs animés, faux tableaux de bord, textes contournés, scan lines, icônes clipart.

### Direction 1 — « Étiquette » · le cartel de précision

**Idée :** les codes du catalogue imprimé (étiquette de famille, triangle de couverture, tableau de specs) traduits en **cartel de musée** : petits libellés précis, filets fins, rigueur suisse. Le sérieux d'une fiche technique avec l'élégance d'une galerie.

- **Typo :**
  - Host Grotesk 300–600 pour les titres et le texte (display en 300, interlettrage −2 %) ;
  - Barlow Condensed 500 en capitales espacées (+12 %) pour les étiquettes, références et chiffres clés.
- **Couleurs :** blanc `#FFFFFF`, papier `#F6F7F7`, encre `#0F1214`, filet `#E3E7E8`, gris texte `#5B6568`, cyan `#49B5BF` (marqueur triangle, onglet actif, unités).
- **Rythme :** grille 12 colonnes stricte et visible par ses filets. Ferré à gauche. Alternance régulière, presque métronomique : grand titre, cartel, produit, tableau. Un « staccato » précis.
- **Séparateurs :**
  - filet horizontal entaillé d'une encoche triangulaire à 60° (le triangle de couverture, en petit) ;
  - onglets d'index en papier blanc légèrement surélevés (ombre 1 px) en tête de section ;
  - ligne de prédécoupe pointillée avant les CTA.
- **Composants signature :**
  - étiquette fine (puce encre, texte blanc, 11 px capitales) en tête de chaque bloc ;
  - index de gammes collant à onglets 01–06 avec indicateur cyan qui glisse ;
  - fiche produit en fiche technique (tableau collant, chiffres clés en grands caractères condensés) ;
  - comparateur côte à côte.
- **Micro-animations (vives et exactes, 500–700 ms, décalage 40 ms) :**
  - titres révélés ligne par ligne par masque ;
  - filets qui se tracent de gauche à droite ;
  - étiquettes qui s'impriment par masque horizontal ;
  - indicateur d'onglet qui glisse (Flip) ;
  - ligne de spec survolée soulignée d'un filet cyan relié à la cote correspondante sur la photo ;
  - flèche des boutons qui pousse le texte ;
  - léger zoom produit (1,03) au survol.

### Direction 2 — « Trace » · le reflet et la buée

**Idée :** chaque machine laisse une bande parfaitement propre. Sur des sols clairs (marbre blanc, terrazzo clair, béton ciré pâle), une fine **buée de poussière** se dissipe au passage du curseur et du défilement et révèle un sol éclatant et réfléchissant. Le propre comme lumière.

- **Typo :**
  - Hanken Grotesk 200–300 en display géant et aérien (interlettrage −3 %), 500 pour l'interface ;
  - JetBrains Mono 400 en petit corps pour les cotes, références et unités.
- **Couleurs :** blanc `#FFFFFF`, brume `#F3F6F7`, encre `#1A1F21`, gris `#6B7477`, cyan `#3FB6C2`, reflet `#E9F5F7` (dégradés de reflet uniquement).
- **Rythme :** asymétrique et horizontal. De larges bandes traversent l'écran comme des passages de machine, avec de longues respirations entre elles. Tempo lent, ample.
- **Séparateurs :**
  - arc de raclette incurvé (le « suceur incurvé » des fiches) en blanc sur brume ;
  - traînée humide qui sèche (dégradé de transparence) ;
  - ligne de reflet (filet lumineux qui glisse au scroll).
- **Composants signature :**
  - hero : le curseur (ou le doigt) passe comme une raclette et dissipe la buée, révélant le sol brillant (canvas 2D, la buée revient lentement) ;
  - curseur avant/après à poignée de raclette ;
  - bande de largeur de travail proportionnelle à la valeur réelle de chaque machine (430 → 1 360 mm) ;
  - guide de choix en « passages » successifs.
- **Micro-animations (lentes et amples, 1 000–1 400 ms) :**
  - révélations par balayage le long d'une courbe (clip-path) ;
  - désembuage des titres et images (flou 12 px et voile blanc → net) ;
  - reflet qui suit le curseur sur les cartes produit ;
  - goutte qui perle et glisse sur le CTA au survol.

### Direction 3 — « Rondeur » · l'orbite

**Idée :** le logo GRILLOO est rond. Ses « oo » deviennent deux disques, c'est-à-dire des brosses et des plateaux. Le site est une composition **centrée et orbitale** sur fond blanc : cercles au trait fin, disques cyan nets en touches, produits dans des hublots.

- **Typo :**
  - Unbounded 300–500 (large et arrondie comme le logo ; utilisée légère pour l'élégance) en titres ;
  - Inter Tight 400–500 en texte.
- **Couleurs :** blanc `#FFFFFF`, écume `#EEF8F9`, cyan `#49B5BF` (disques et accents), sarcelle `#0D5560` (liens et chiffres), encre `#0B2A2E`. Pas d'aplat cyan pleine page : le cyan vit dans des disques nets de taille limitée.
- **Rythme :** symétrique, centré, en spirale. Les sections s'enchaînent autour d'un axe vertical avec des respirations circulaires. Tempo continu et doux.
- **Séparateurs :**
  - hublot (la section suivante s'ouvre dans un cercle qui s'agrandit) ;
  - feston fin de tête de brosse au trait ;
  - chaîne de cercles au trait qui se chevauchent.
- **Composants signature :**
  - produits dans des hublots, chiffres clés en orbite ;
  - carrousel circulaire des 6 gammes ;
  - texte qui tourne en cercle autour du CTA devis ;
  - 7 engagements en pastilles.
- **Micro-animations (continues et fluides, 800–1 100 ms) :**
  - disques qui tournent selon la vitesse du défilement puis reviennent à une rotation lente ;
  - transitions de page en iris ;
  - masques circulaires qui s'agrandissent sur les images ;
  - boutons magnétiques (pointeur fin uniquement) ;
  - orbites qui se tracent au trait.

## 6. Visuels à générer (GPT image, `scripts/gen-images.mjs`)

Modèle : `gpt-image-2.5-*` si le rendu est meilleur à l'essai, sinon `gpt-image-2`. Prompts versionnés dans `scripts/prompts.json`. Pas de texte, pas de logos, pas de visages en gros plan. **Tous high-key, lumineux, tons clairs.**

| Lot | Contenu | Format | Direction(s) |
|---|---|---|---|
| Ambiances (8) | couloir de clinique, entrepôt logistique, hall de centre commercial, lobby d'hôtel au sol en marbre clair, atelier agroalimentaire, parvis public / gare, parking couvert, escalator de centre commercial — architecture marocaine contemporaine, lumière naturelle abondante, sans machine | 1536×1024 | toutes |
| Sols (6) | paires voilé / éclatant : marbre blanc, terrazzo clair, béton ciré pâle (vue zénithale, même cadrage ; la version « voilée » est poussiéreuse et terne, jamais sombre) | 1536×1024 | Trace |
| Objets ronds (6) | disque de brosse blanc, pad, plateau porte-disque, goutte d'eau, écume, brosse latérale — vue de dessus, fond transparent, tons blancs et cyan | 1024×1024 PNG | Rondeur |
| Matières (3) | papier blanc texturé, polymère blanc mat, eau sur sol poli clair | 1536×1024 | Étiquette, Trace |

Icônes et pictogrammes (gammes, unités, secteurs, engagements) : **dessinés en SVG à la main**, un jeu par direction : trait 1,25 px à angles vifs pour Étiquette, trait 1 px arrondi pour Trace, formes arrondies au trait 1,5 px pour Rondeur.

Produits : détourages existants du catalogue, recadrés et normalisés (même hauteur optique, ombre de contact). Le README listera les photos HD à demander au client.

## 7. Ordre de réalisation

1. **Socle** : données nettoyées, build, gabarits SEO, guide de choix (logique), formulaire, vérificateur de liens, génération des visuels.
2. **Direction 1 « Étiquette »** complète (14 pages + 75 fiches) → captures desktop et mobile → je vous l'ouvre en local.
3. **Direction 2 « Trace »** complète → idem.
4. **Direction 3 « Rondeur »** complète → idem.
5. **Page de choix** `dist/index.html` présentant les 3 directions, README (ouverture locale, déploiement Netlify/Vercel, photos à fournir, points à confirmer).

Je montre chaque direction dès qu'elle est terminée. Sans retour de votre part, je passe à la suivante.

## 8. Vérification

- `node src/build.mjs` sans erreur ; nombre de fichiers attendu (3 × 89 pages + index).
- `scripts/check-links.mjs` : zéro lien ou image cassé dans `dist/`.
- Captures 1440 px et 390 px de l'accueil, du catalogue, d'une fiche, d'une gamme, du guide de choix et du contact pour chaque direction ; relecture visuelle.
- Test `prefers-reduced-motion` et navigation clavier sur une page par direction.
- Contrôle que chaque chiffre affiché sur les pages gammes et accueil provient de `catalog.json` (pas de valeur saisie à la main).
- Ouverture finale en `file://` par double-clic dans le navigateur par défaut.

## 9. Hors périmètre de cette phase

Back-office / CMS, version arabe ou anglaise, prix et e-commerce, vraie carte (Google Maps), analytics et pixels publicitaires, mise en ligne effective, réécriture des textes traduits automatiquement (signalés au client, affichés corrigés a minima).
