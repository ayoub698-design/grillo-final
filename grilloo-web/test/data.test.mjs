import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadData, productsOf, productBySlug, related, rangeOf } from '../src/lib/data.mjs';

test('75 products, each with a known gamme', () => {
  const d = loadData();
  assert.equal(d.products.length, 75);
  const g = new Set(d.gammes.map((x) => x.slug));
  assert.equal(g.size, 6);
  for (const p of d.products) assert.ok(g.has(p.gamme), p.slug);
});

test('no third-party mention in displayed text', () => {
  const txt = JSON.stringify(loadData().products.map((p) => [p.lead, p.description, p.features, p.specs, p.accessories]));
  for (const bad of ['JS Floor', 'Home Base', 'ROND®', 'PW 30/1', 'DT021', '510 ventilateur']) assert.ok(!txt.includes(bad), bad);
});

test('rangeOf ignores nulls and returns null when empty', () => {
  assert.deepEqual(rangeOf([{ key: { productivity: 1200 } }, { key: { productivity: null } }, { key: { productivity: 12000 } }], 'productivity'), { min: 1200, max: 12000 });
  assert.equal(rangeOf([{ key: { productivity: null } }], 'productivity'), null);
  assert.equal(rangeOf([], 'productivity'), null);
});

test('autolaveuses range is 1200–12000 m²/h', () => {
  const d = loadData();
  assert.deepEqual(rangeOf(productsOf(d, 'autolaveuses'), 'productivity'), { min: 1200, max: 12000 });
});

test('every sector lists existing products', () => {
  const d = loadData();
  assert.equal(d.sectors.length, 6);
  for (const s of d.sectors) {
    assert.ok(s.products.length > 0, s.slug);
    for (const slug of s.products) assert.ok(productBySlug(d, slug), slug);
  }
});

test('related() excludes the product itself and stays in gamme', () => {
  const d = loadData();
  const p = productBySlug(d, 'g53');
  const r = related(d, p);
  assert.ok(r.length > 0 && r.length <= 4);
  assert.ok(r.every((x) => x.slug !== 'g53' && x.gamme === p.gamme));
});

test('site, pages and brand are loaded', () => {
  const d = loadData();
  assert.equal(d.brand.values.length, 7);
  assert.equal(d.site.stoneSteps.length, 7);
  assert.ok(d.pages.home.h1);
});
