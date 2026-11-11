import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../src/lib/data.mjs';
import { recommend, NOTE } from '../src/lib/guide.mjs';

const d = loadData();

test('1 500 m² in 1 h on hard floor → only machines ≥ 1 500 m²/h, smallest first', () => {
  const r = recommend(d.products, { surfaceType: 'dur', area: 1500, hours: 1, energy: 'indifferent', cluttered: false });
  assert.equal(r.needed, 1500);
  assert.ok(r.items.length > 0 && r.items.length <= 6);
  assert.ok(r.items.every((p) => p.key.productivity >= 1500));
  assert.ok(r.items[0].key.productivity <= r.items.at(-1).key.productivity);
  assert.equal(r.note, NOTE);
});

test('needed is rounded up', () => {
  assert.equal(recommend(d.products, { surfaceType: 'dur', area: 1000, hours: 3 }).needed, 334);
});

for (const area of [0, -5, NaN, undefined, '', 'abc']) {
  test(`area=${String(area)} gives needed=null, no throw`, () => {
    const r = recommend(d.products, { surfaceType: 'dur', area, hours: 1 });
    assert.equal(r.needed, null);
    assert.ok(Array.isArray(r.items));
  });
}

test('numeric strings are accepted', () => {
  assert.equal(recommend(d.products, { surfaceType: 'dur', area: '2000', hours: '2' }).needed, 1000);
});

test('hours 0 gives needed=null', () => {
  assert.equal(recommend(d.products, { surfaceType: 'dur', area: 100, hours: 0 }).needed, null);
});

test('200 000 m² in 1 h → empty items, no throw', () => {
  assert.equal(recommend(d.products, { surfaceType: 'dur', area: 200000, hours: 1 }).items.length, 0);
});

test('exterieur returns only balayeuses', () => {
  const r = recommend(d.products, { surfaceType: 'exterieur', area: 5000, hours: 1 });
  assert.ok(r.items.length > 0 && r.items.every((p) => p.gamme === 'balayeuses'));
});

test('energy filter keeps only that energy', () => {
  const r = recommend(d.products, { surfaceType: 'dur', area: 500, hours: 1, energy: 'secteur' });
  assert.ok(r.items.every((p) => p.key.energy === 'secteur'));
});

test('cluttered puts narrow machines (≤ 600 mm) first', () => {
  const r = recommend(d.products, { surfaceType: 'dur', area: 1000, hours: 1, cluttered: true });
  const firstWide = r.items.findIndex((p) => !(p.key.width <= 600));
  if (firstWide !== -1) assert.ok(r.items.slice(firstWide).every((p) => !(p.key.width <= 600)));
});

test('textile includes injecteurs and the two aspiro-brosseurs', () => {
  const r = recommend(d.products, { surfaceType: 'textile' });
  const slugs = r.items.map((p) => p.slug);
  assert.ok(r.items.every((p) => p.family === 'injecteurs' || ['gsb2', 'gsb660'].includes(p.slug)));
  assert.ok(slugs.length > 0);
});

test('unknown surface type → empty items', () => {
  assert.deepEqual(recommend(d.products, { surfaceType: 'lune', area: 10, hours: 1 }).items, []);
});

test('limit option: Infinity returns every matching machine', () => {
  const all = recommend(d.products, { surfaceType: 'dur', area: 500, hours: 1, limit: Infinity });
  const six = recommend(d.products, { surfaceType: 'dur', area: 500, hours: 1 });
  assert.equal(six.items.length, 6);
  assert.ok(all.items.length > 6);
});
