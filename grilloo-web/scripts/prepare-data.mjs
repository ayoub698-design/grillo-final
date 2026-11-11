// One-off, reproducible preparation of data/catalog.json, gammes.json, sectors.json
// from the catalogue transcription (../grilloo-catalogue/lib/catalog-data.json).
// Rules (spec §2): spec table wins over prose; third-party mentions removed.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(readFileSync(join(root, '../grilloo-catalogue/lib/catalog-data.json'), 'utf8'));

const GAMME_OF = {
  autolaveuses: 'autolaveuses', autoportees: 'autolaveuses', aspirateurs: 'aspirateurs', balayeuses: 'balayeuses',
  monobrosses: 'traitement-des-sols', polisseuses: 'traitement-des-sols',
  injecteurs: 'textiles-sechage', souffleurs: 'textiles-sechage',
  escalators: 'equipements-specialises', equipements: 'equipements-specialises',
};

// [slug, from (string|RegExp), to | null (null = drop the whole string)]
const EDITS = [
  ['g01m', 'autonomie de 1h20', 'autonomie de 1 à 1,2 heure'],
  ['g02m', 'avec 6 litres de capacité', 'avec un réservoir de solution de 3,5 litres'],
  ['g02m', 'petit format de 6 litres', 'petit format de 3,5 litres'],
  ['g02m', 'pression allant jusqu’à 8 kg', 'pression allant jusqu’à 12 kg'],
  ['g02m', 'Rendement surfacique jusqu’à 1300 m²/heure', null],
  ['g53', 'd’une capacité de 56 litres', 'de 45 litres de solution et 56 litres de récupération'],
  ['g53', 'grand format de 56 litres', 'grand format de 45 litres'],
  ['g54', 'd’une capacité de 65 litres', 'de 60 litres de solution et 65 litres de récupération'],
  ['g54', 'grand format de 65 litres', 'grand format de 60 litres'],
  ['g50', 'd’une capacité de 65 litres', 'de 60 litres de solution et 65 litres de récupération'],
  ['g50', 'grand format de 65 litres', 'grand format de 60 litres'],
  ['g50', 'jusqu’à 2.500 m²/heure', 'jusqu’à 2 600 m²/heure'],
  ...['g53', 'g54', 'g50'].flatMap((s) => [
    [s, 'avec pression de 30 kg', 'avec pression de 40 kg'],
    [s, 'Pression de 40 kg ou 50 kg', 'Pression de brosse de 40 kg'],
    [s, 'peut atteindre 40 kg-50 kg et grâce d’autonomie 3 heure', 'atteint 40 kg et l’autonomie est de 3 heures'],
  ]),
  ['g7', 'a une largeur de 61 cm avec un brosses', 'a une largeur de 51 cm avec une brosse'],
  ['g7', 'Plateau de brosse de 53 cm', 'Plateau de brosse de 51 cm'],
  ['g7', 'Pression de brosse ou disque de 50 kg', 'Pression de contact des brosses de 20 kg'],
  ['g9', 'pouvant atteindre 75 kg', 'pouvant atteindre 70 kg'],
  ['g9', 'grand format de 140 litres', 'grand format de 130 litres'],
  ['g9', 'avec pression de 75 kg', 'avec pression de 70 kg'],
  ['g90', 'grand format de 140 litres', 'grand format de 120 litres'],
  ['g90', 'tête de brosse de 85 cm', 'tête de brosse de 91 cm'],
  ['g100', 'pouvant atteindre 96 kg', 'pouvant atteindre 120 kg'],
  ['g100', '346/285 litres', '285 litres (récupération 346 litres)'],
  ['g100', '101.5 cm', '101,5 cm'],
  ['g100', 'batterie Lithium option au batterie gel standard', null],
  ['g10', 'La G100 convient', 'La G10 convient'],
  ['g10', 'tête de brosse de 81 cm', 'largeur de nettoyage de 90 cm'],
  ['g10', '166/132 litres', '132 litres (récupération 166 litres)'],
  ['g10', 'batterie Lithium option à la batterie gel standard', null],
  ['g120', 'avec pression de 90 kg', 'avec pression de 96 kg'],
  ['g120', '300/260 litres', '260 litres (récupération 300 litres)'],
  // third-party mentions (spec §2.3)
  ['gs-tne4', 'Pourquoi utiliser l’aspirateur à extracteur de poussière JS Floor', null],
  ['gs-tne4', 'aux meuleuses de béton à usage intensif JS Floor Systems S750, S850, S950, D1400 et aux séries de meuleuses de sol télécommandées', 'aux meuleuses de béton à usage intensif et aux meuleuses de sol télécommandées'],
  ['gs-tne4', 'Achetez avec JS Floor Systems', null],
  ['gb3', 'le kit Home Base permet', 'un support intégré permet'],
  ['gbe3', 'Le concept GRILLOO Home Base permet également', 'Un support intégré permet également'],
  ['gb13', 'Le système Home Base intelligent permet aussi', 'Un support intégré permet aussi'],
  ['gh53', 'PW 30/1', null],
  ['gk200', /^510 ventilateur est une série.*$/, 'Ventilateur professionnel léger, conçu pour une longue durée de vie et un fonctionnement sans entretien.'],
  ['ge30', 'La technologie ROND® permet', 'Ce système permet'],
];
const BANNED = ['JS Floor', 'Home Base', 'ROND®', 'PW 30/1', 'DT021', '510 ventilateur', 'Stunde'];

function mapStrings(value, fn) {
  if (typeof value === 'string') return fn(value);
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn)).filter((v) => v !== null);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === 'slug' || k === 'img' || k === 'issues' ? v : mapStrings(v, fn)]));
  return value;
}

const products = src.products.map((p) => {
  let out = { ...p, gamme: GAMME_OF[p.family] };
  for (const [slug, from, to] of EDITS.filter((e) => e[0] === p.slug)) {
    let hit = false;
    out = mapStrings(out, (s) => {
      const matches = typeof from === 'string' ? s.includes(from) : from.test(s);
      if (!matches) return s;
      hit = true;
      return to === null ? null : s.replace(from, to);
    });
    if (!hit) throw new Error(`edit not applied: ${slug} ← ${from}`);
  }
  out = mapStrings(out, (s) => s.replace(/ DT021/g, '').replace(/Stunde/g, 'heure'));
  if (!out.gamme) throw new Error(`no gamme for ${p.slug}`);
  return out;
});

for (const p of products) {
  const visible = JSON.stringify({ ...p, issues: undefined });
  for (const b of BANNED) if (visible.includes(b)) throw new Error(`banned "${b}" left in ${p.slug}`);
}

// Sectors: keyword match on the catalogue's own sector mentions + prose.
const SECTORS = [
  { slug: 'sante', name: 'Santé & établissements médicalisés', kw: ['médicalis', 'pharma', 'laboratoire'] },
  { slug: 'logistique', name: 'Logistique, entrepôts & parkings', kw: ['entrepôt', 'logisti', 'parking', 'aires de chargement', 'stations-service', 'quai'] },
  { slug: 'industrie', name: 'Industrie & agroalimentaire', kw: ['industri', 'usine', 'ateliers de production', 'fabrication', 'alimentaire', 'abattoir', 'chimi', 'aérospatiale'] },
  { slug: 'commerce', name: 'Commerce & surfaces de vente', kw: ['commerc', 'magasin', 'showroom', 'concessionnaire', 'halls d’exposition', 'escalator', 'escaliers mécaniques'] },
  { slug: 'hotellerie', name: 'Hôtellerie & restauration', kw: ['hôtel', 'maisons d’hôtes', 'cuisines centrales', 'restaura'] },
  { slug: 'collectivites', name: 'Collectivités & espaces publics', kw: ['public', 'municipal', 'école', 'campus', 'collectivit', 'parcs', 'gymnase', 'trottoir'] },
];
const INTRO = {
  sante: 'Couloirs, chambres, halls d’accueil : les machines que le catalogue recommande pour les établissements médicalisés et les environnements pharmaceutiques.',
  logistique: 'Grandes surfaces, poussière, allées de circulation : les machines que le catalogue destine aux entrepôts, aires de chargement et parkings.',
  industrie: 'Ateliers, production, agroalimentaire, environnements à poussières : les équipements que le catalogue associe aux sites industriels.',
  commerce: 'Surfaces de vente, showrooms, escalators : les machines que le catalogue cite pour les espaces commerciaux.',
  hotellerie: 'Halls, moquettes, cuisines : les machines que le catalogue associe à l’hôtellerie et aux cuisines collectives.',
  collectivites: 'Bâtiments publics, écoles, voirie : les machines que le catalogue destine aux collectivités et aux espaces publics.',
};
const sectors = SECTORS.map(({ slug, name, kw }) => ({
  slug, name, intro: INTRO[slug],
  products: products
    .filter((p) => {
      const hay = (p.sectors || []).join(' ').toLowerCase(); // the catalogue's own sector lists only (prose matching produced false tags)
      return kw.some((k) => hay.includes(k));
    })
    .map((p) => p.slug),
}));

const fam = Object.fromEntries(src.families.map((f) => [f.slug, f]));
const gammes = [
  { slug: 'autolaveuses', name: 'Autolaveuses', label: 'AUTOLAVEUSE', families: ['autolaveuses', 'autoportees'],
    intro: [fam.autoportees.intro],
    criteria: ['Rendement surfacique (m²/h)', 'Largeur de nettoyage', 'Réservoir de solution', 'Autonomie par charge', 'Accompagnée, autoportée ou autonome'],
    faq: [
      { q: 'Quel rendement pour une autolaveuse GRILLOO ?', a: 'De {productivity.min} à {productivity.max} m²/h selon le modèle (rendements théoriques du catalogue).' },
      { q: 'Quelle autonomie ?', a: 'De {autonomy.min} à {autonomy.max} h par charge selon le modèle.' },
      { q: 'Quelle largeur de nettoyage ?', a: 'De {width.min} à {width.max} mm.' },
    ] },
  { slug: 'aspirateurs', name: 'Aspirateurs', label: 'ASPIRATEUR', families: ['aspirateurs'],
    intro: [fam.aspirateurs.intro, ...(fam.aspirateurs.introLong || []).slice(0, 1)],
    criteria: ['Capacité de la cuve', 'Puissance', 'Eau et poussière ou poussière seule', 'Cuve inox ou PVC', 'Usage industriel ou zones à poussières explosives'],
    faq: [
      { q: 'Quelles capacités de cuve ?', a: 'De {tank.min} à {tank.max} litres selon le modèle.' },
      { q: 'Quelles puissances ?', a: 'De {power.min} à {power.max} W selon le modèle.' },
      { q: 'Existe-t-il des modèles industriels ?', a: 'Oui : la gamme GS-TNE et GS-TEX comprend des aspirateurs industriels, dont des modèles antidéflagrants (voir les fiches).' },
    ] },
  { slug: 'balayeuses', name: 'Balayeuses', label: 'BALAYEUSE', families: ['balayeuses'],
    intro: [fam.balayeuses.intro],
    criteria: ['Rendement surfacique (m²/h)', 'Largeur de balayage', 'Capacité du bac à déchets', 'Manuelle, accompagnée ou autoportée', 'Intérieur ou extérieur'],
    faq: [
      { q: 'Quel rendement pour une balayeuse GRILLOO ?', a: 'De {productivity.min} à {productivity.max} m²/h selon le modèle.' },
      { q: 'Quelle largeur de balayage ?', a: 'De {width.min} à {width.max} mm, brosses latérales comprises.' },
      { q: 'Quelle capacité de bac ?', a: 'De {tank.min} à {tank.max} litres selon le modèle.' },
    ] },
  { slug: 'traitement-des-sols', name: 'Traitement des sols', label: 'MONOBROSSE · POLISSEUSE', families: ['monobrosses', 'polisseuses'],
    intro: [fam.monobrosses.intro, fam.polisseuses.intro],
    criteria: ['Lavage, décapage ou lustrage', 'Vitesse de rotation', 'Diamètre du plateau', 'Puissance du moteur', 'Poids et lestage'],
    faq: [
      { q: 'Monobrosse ou polisseuse ?', a: 'Les monobrosses du catalogue servent au lavage et au décapage (et à la cristallisation pour la M4) ; les polisseuses donnent la brillance aux sols. La vitesse de rotation de chaque modèle figure sur sa fiche.' },
      { q: 'Quelles puissances ?', a: 'De {power.min} à {power.max} W selon le modèle.' },
      { q: 'Peut-on rénover un sol en pierre ?', a: 'Oui, voir notre guide de rénovation en 7 étapes et les polisseuses GP1800.' },
    ] },
  { slug: 'textiles-sechage', name: 'Textiles & séchage', label: 'INJECTEUR · SOUFFLEUR', families: ['injecteurs', 'souffleurs'],
    intro: [fam.injecteurs.intro],
    criteria: ['Moquettes, tapis ou sièges', 'Capacité des réservoirs', 'Largeur de travail', 'Débit d’air (souffleurs)', 'Encombrement et transport'],
    faq: [
      { q: 'À quoi sert un injecteur-extracteur ?', a: 'L’eau et le détergent sont pulvérisés dans les fibres puis immédiatement réaspirés : le textile est nettoyé en profondeur et sèche vite.' },
      { q: 'Pourquoi un souffleur ?', a: 'Les souffleurs accélèrent le séchage des moquettes et des sols durs après lavage.' },
      { q: 'Quelles capacités ?', a: 'De {tank.min} à {tank.max} litres selon le modèle.' },
    ] },
  { slug: 'equipements-specialises', name: 'Équipements spécialisés', label: 'ÉQUIPEMENT', families: ['escalators', 'equipements'],
    intro: ['Machines d’escalator, perche télescopique, nettoyeur haute pression, canon à mousse et compresseurs : les équipements GRILLOO pour les besoins spécifiques.'],
    criteria: ['Escalators et tapis roulants', 'Vitres, façades et panneaux solaires', 'Haute pression', 'Moussage et désinfection', 'Air comprimé'],
    faq: [
      { q: 'Comment nettoyer un escalator ?', a: 'Les machines GE se posent sur les marches et nettoient les rainures par brossage, détergent et aspiration (voir les fiches GE30, GE33, GE30B).' },
      { q: 'Quels compresseurs ?', a: 'La gamme de compresseurs à pistons GRILLOO V / W va de 1,5 kW à 15 kW (détail des modèles sur la fiche).' },
      { q: 'Quel nettoyeur haute pression ?', a: 'Le GNH150 travaille de 30 à 150 bar (190 bar maximum).' },
    ] },
];

writeFileSync(join(root, 'data/catalog.json'), JSON.stringify(products, null, 1));
writeFileSync(join(root, 'data/sectors.json'), JSON.stringify(sectors, null, 1));
writeFileSync(join(root, 'data/gammes.json'), JSON.stringify(gammes, null, 1));
writeFileSync(join(root, 'data/brand.json'), JSON.stringify(src.brand, null, 1));
console.log(`products ${products.length}; sectors ${sectors.map((s) => `${s.slug}:${s.products.length}`).join(' ')}`);
