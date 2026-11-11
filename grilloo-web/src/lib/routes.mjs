import { productsOf, rangeOf } from './data.mjs';
import { fmt, truncate } from './format.mjs';

const GAMME_TITLE = { autolaveuses: 'Autolaveuses professionnelles', aspirateurs: 'Aspirateurs professionnels', balayeuses: 'Balayeuses professionnelles', 'traitement-des-sols': 'Monobrosses et polisseuses', 'textiles-sechage': 'Injecteurs-extracteurs et souffleurs', 'equipements-specialises': 'Équipements de nettoyage spécialisés' };
const HOME = { label: 'Accueil', file: 'index.html' };

export function routes(data) {
  const page = (id, file, kind, crumbLabel, params = {}) => ({
    id, file, kind, params,
    title: data.pages[id].title, description: data.pages[id].description,
    crumbs: kind === 'home' ? [HOME] : [HOME, { label: crumbLabel, file }],
  });
  const list = [
    page('home', 'index.html', 'home', 'Accueil'),
    page('catalogue', 'catalogue.html', 'catalogue', 'Catalogue'),
  ];
  for (const g of data.gammes) {
    const items = productsOf(data, g.slug);
    const r = rangeOf(items, 'productivity');
    const range = r ? `, de ${fmt(r.min)} à ${fmt(r.max)} m²/h` : '';
    list.push({
      id: `gamme-${g.slug}`, file: `gammes/${g.slug}.html`, kind: 'gamme', params: { gamme: g.slug },
      title: `${GAMME_TITLE[g.slug]} — ${items.length} modèles | GRILLOO`,
      description: truncate(`${g.name} GRILLOO : ${items.length} modèles${range}. Caractéristiques, comparatif et demande de devis.`),
      crumbs: [HOME, { label: 'Catalogue', file: 'catalogue.html' }, { label: g.name, file: `gammes/${g.slug}.html` }],
    });
  }
  list.push(
    page('robot', 'robotclean-g-plus.html', 'robot', 'RoboClean G+'),
    page('secteurs', 'secteurs.html', 'secteurs', 'Secteurs'),
    page('guide', 'guide-de-choix.html', 'guide', 'Guide de choix'),
    page('guide-pierre', 'guides/renover-sol-pierre.html', 'guide-pierre', 'Rénover un sol en pierre'),
    page('about', 'a-propos.html', 'about', 'À propos'),
    page('contact', 'contact.html', 'contact', 'Demander un devis'),
  );
  for (const p of data.products) {
    const g = data.gammes.find((x) => x.slug === p.gamme);
    list.push({
      id: `product-${p.slug}`, file: `produits/${p.slug}.html`, kind: 'product', params: { slug: p.slug },
      title: `${p.kind} GRILLOO ${p.name} — fiche technique | GRILLOO`,
      description: truncate(p.lead || p.description?.[0] || `${p.kind} GRILLOO ${p.name} : caractéristiques techniques, accessoires et demande de devis.`),
      crumbs: [HOME, { label: g.name, file: `gammes/${g.slug}.html` }, { label: p.name, file: `produits/${p.slug}.html` }],
    });
  }
  return list;
}
