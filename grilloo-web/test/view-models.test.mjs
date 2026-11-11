import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../src/lib/data.mjs';
import { fmt } from '../src/lib/format.mjs';
import { productModel, gammeModel, homeModel, robotModel, sectorsModel } from '../src/lib/view-models.mjs';

const d = loadData();

test('productModel: key figures skip nulls, max 4, labelled per gamme', () => {
  const m = productModel(d, 'g53');
  assert.ok(m.keyFigures.length > 0 && m.keyFigures.length <= 4);
  assert.deepEqual(m.keyFigures[0], { key: 'productivity', label: 'Rendement', value: fmt(2200), unit: 'm²/h' });
  const sus = productModel(d, 'sus304');
  assert.ok(sus.keyFigures.every((k) => k.value && k.value !== 'null'));
  assert.equal(productModel(d, 'gs60').keyFigures.find((k) => k.key === 'tank')?.label, 'Cuve');
});

test('productModel: lead falls back to first description paragraph, rest excludes it', () => {
  const m = productModel(d, 'gs5');
  assert.equal(typeof m.lead, 'string');
  const g = productModel(d, 'g53');
  assert.equal(g.lead, g.p.lead);
});

test('productModel: variants become a table with one column per variant', () => {
  const m = productModel(d, 'gs60');
  assert.deepEqual(m.variants.columns, ['GS60', 'GS60+']);
  assert.ok(m.variants.rows.length > 0 && m.variants.rows.every((r) => r.values.length === 2));
  assert.equal(productModel(d, 'g53').variants, null);
});

test('productModel: related in same gamme, sectors resolved, images listed', () => {
  const m = productModel(d, 'g54');
  assert.ok(m.related.length > 0);
  assert.ok(m.sectors.every((s) => s.slug && s.name));
  assert.deepEqual(m.images[0], 'g54');
  assert.deepEqual(productModel(d, 'gsb660').images, ['gsb660', 'gsb660-d1', 'gsb660-d2', 'gsb660-d3']);
});

test('gammeModel: ranges and FAQ filled, unfillable FAQ dropped', () => {
  const m = gammeModel(d, 'autolaveuses');
  assert.equal(m.count, 17);
  assert.deepEqual(m.ranges.productivity, { min: 1200, max: 12000 });
  assert.ok(m.faq.every((f) => !/\{|undefined|null|NaN/.test(f.a)));
  assert.ok(m.faq[0].a.includes(fmt(1200)));
});

test('homeModel: 6 gammes with 3 sample products each, 6 sectors with images, 7 values', () => {
  const m = homeModel(d);
  assert.equal(m.gammes.length, 6);
  assert.ok(m.gammes.every((g) => g.samples.length === 3 && g.count > 0));
  assert.equal(m.sectors.length, 6);
  assert.ok(m.sectors.every((s) => s.img.startsWith('amb-')));
  assert.equal(m.values.length, 7);
  assert.equal(m.totals.products, 75);
});

test('robotModel: sections built from the catalogue text', () => {
  const m = robotModel(d);
  assert.equal(m.sections.length, 3);
  assert.ok(m.sections.every((s) => s.title && s.paragraphs.length > 0));
});

test('sectorsModel: each sector has products and an image', () => {
  const s = sectorsModel(d);
  assert.equal(s.length, 6);
  assert.ok(s.every((x) => x.products.length > 0 && x.img));
});
