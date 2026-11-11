import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../src/lib/data.mjs';
import { routes } from '../src/lib/routes.mjs';
import { rel } from '../src/lib/paths.mjs';

const r = routes(loadData());

test('89 routes with unique files', () => {
  assert.equal(r.length, 89);
  assert.equal(new Set(r.map((x) => x.file)).size, 89);
});
test('spec URL table', () => {
  const files = new Set(r.map((x) => x.file));
  for (const f of ['index.html', 'catalogue.html', 'produits/g53.html', 'gammes/autolaveuses.html', 'gammes/aspirateurs.html', 'gammes/balayeuses.html',
    'gammes/traitement-des-sols.html', 'gammes/textiles-sechage.html', 'gammes/equipements-specialises.html', 'robotclean-g-plus.html',
    'secteurs.html', 'guide-de-choix.html', 'guides/renover-sol-pierre.html', 'a-propos.html', 'contact.html']) assert.ok(files.has(f), f);
});
test('every route has kind, title, description, crumbs starting at home', () => {
  for (const x of r) {
    assert.ok(x.kind && x.title && x.description, x.file);
    assert.equal(x.crumbs[0].file, 'index.html');
  }
});
test('product route params and crumbs go through its gamme', () => {
  const p = r.find((x) => x.file === 'produits/g53.html');
  assert.equal(p.kind, 'product');
  assert.equal(p.params.slug, 'g53');
  assert.ok(p.crumbs.some((c) => c.file === 'gammes/autolaveuses.html'));
});
test('rel', () => {
  assert.equal(rel('produits/g53.html', 'gammes/autolaveuses.html'), '../gammes/autolaveuses.html');
  assert.equal(rel('index.html', 'assets/style.css'), 'assets/style.css');
  assert.equal(rel('index.html', 'index.html'), 'index.html');
  assert.equal(rel('produits/g53.html', 'produits/gb3.html'), 'gb3.html');
  assert.equal(rel('guides/renover-sol-pierre.html', 'index.html'), '../index.html');
});
