import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../src/lib/data.mjs';
import { filterProducts, fold } from '../src/lib/catalogue-filter.mjs';

const d = loadData();

test('fold removes accents and case', () => assert.equal(fold('AutoPortée'), 'autoportee'));
test('q is accent-insensitive', () => assert.ok(filterProducts(d.products, { q: 'autoportee' }).length >= 8));
test('empty filters return all 75', () => assert.equal(filterProducts(d.products, {}).length, 75));
test('gamme filter', () => {
  const r = filterProducts(d.products, { gamme: 'balayeuses' });
  assert.ok(r.length > 0 && r.every((p) => p.gamme === 'balayeuses'));
});
test('energy filter', () => assert.ok(filterProducts(d.products, { energy: 'manuel' }).every((p) => p.key.energy === 'manuel')));
test('minProductivity excludes nulls and smaller', () => {
  const r = filterProducts(d.products, { minProductivity: 5000 });
  assert.ok(r.length > 0 && r.every((p) => p.key.productivity >= 5000));
});
test('rendement-desc puts nulls last', () => {
  const r = filterProducts(d.products, { sort: 'rendement-desc' });
  assert.equal(r[0].key.productivity, 36000);
  assert.equal(r.at(-1).key.productivity ?? null, null);
});
test('rendement-asc puts nulls last', () => {
  const r = filterProducts(d.products, { sort: 'rendement-asc' });
  assert.equal(r[0].key.productivity, 130);
  assert.equal(r.at(-1).key.productivity ?? null, null);
});
test('nom sorts alphabetically (natural)', () => {
  const r = filterProducts(d.products, { gamme: 'autolaveuses', sort: 'nom' }).map((p) => p.name);
  assert.ok(r.indexOf('G5') < r.indexOf('G50'));
});
