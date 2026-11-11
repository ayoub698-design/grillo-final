import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { SECTOR_SET, GAMME_SET, ROBOT_SET, STONE_SET, ABOUT_SET, HERO_FORMATS } from '../src/lib/media.mjs';
import { loadData } from '../src/lib/data.mjs';

const gen = (id) => new URL(`../assets/img/gen/${id}.webp`, import.meta.url);

test('every image of every set exists', () => {
  const all = [...Object.values(SECTOR_SET).flat(), ...Object.values(GAMME_SET).flat(), ...ROBOT_SET.flat(), ...STONE_SET, ...ABOUT_SET];
  for (const id of new Set(all)) assert.ok(existsSync(gen(id)), id);
});
test('each direction has its hero in landscape, square and portrait', () => {
  for (const d of ['etiquette', 'trace', 'rondeur']) for (const k of HERO_FORMATS) assert.ok(existsSync(gen(`hero-${d}-${k}`)), `${d}-${k}`);
});
test('sets cover every sector and gamme with 3 distinct images', () => {
  const d = loadData();
  for (const s of d.sectors) assert.equal(new Set(SECTOR_SET[s.slug]).size, 3, s.slug);
  for (const g of d.gammes) assert.equal(new Set(GAMME_SET[g.slug]).size, 3, g.slug);
});
