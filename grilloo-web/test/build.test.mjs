import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { build } from '../src/build.mjs';
import { checkLinks } from '../scripts/check-links.mjs';

export const IMPLEMENTED = ['_stub', ...['etiquette', 'trace', 'rondeur'].filter((d) => existsSync(new URL(`../src/directions/${d}/index.mjs`, import.meta.url)))];
const out = join(tmpdir(), 'grilloo-build-test');

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const read = (f) => readFileSync(f, 'utf8');
const visibleText = (s) => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');

before(async () => { await build({ directions: IMPLEMENTED, out, chooser: false }); });

for (const dir of IMPLEMENTED) {
  const pages = () => walk(join(out, dir)).filter((f) => f.endsWith('.html'));
  test(`${dir}: 89 pages, sitemap, robots`, () => {
    assert.equal(pages().length, 89);
    assert.ok(existsSync(join(out, dir, 'sitemap.xml')));
    assert.ok(existsSync(join(out, dir, 'robots.txt')));
  });
  test(`${dir}: every page is noindex, lang fr, has exactly one h1`, () => {
    for (const f of pages()) {
      const s = read(f);
      assert.match(s, /<html lang="fr"/, f);
      assert.match(s, /name="robots" content="noindex/, f);
      assert.equal((s.match(/<h1[\s>]/g) || []).length, 1, f);
    }
  });
  test(`${dir}: product page has Product JSON-LD without offers, breadcrumb everywhere`, () => {
    const s = read(join(out, dir, 'produits/g53.html'));
    assert.match(s, /"@type":"Product"/);
    assert.doesNotMatch(s, /"offers"/);
    assert.match(read(join(out, dir, 'catalogue.html')), /"@type":"BreadcrumbList"/);
    assert.match(read(join(out, dir, 'guides/renover-sol-pierre.html')), /"@type":"HowTo"/);
    assert.match(read(join(out, dir, 'index.html')), /"@type":"Organization"/);
  });
  test(`${dir}: no undefined/null/NaN leaks into visible text`, () => {
    for (const f of pages()) assert.doesNotMatch(visibleText(read(f)), /\b(undefined|null|NaN)\b/, f);
  });
  test(`${dir}: no module scripts (blocked over file://) and no fetch of local files`, () => {
    for (const f of pages()) assert.doesNotMatch(read(f), /type="module"/, f);
    const js = walk(join(out, dir, 'assets')).filter((x) => x.endsWith('.js') && !x.includes('vendor'));
    for (const f of js) assert.doesNotMatch(read(f), /\bfetch\(|^\s*import\s/m, f);
  });
  test(`${dir}: no absolute or CDN asset paths`, () => {
    for (const f of pages()) assert.doesNotMatch(read(f), /(src|href)="(\/[^/]|https?:\/\/(cdn|unpkg|fonts\.g))/, f);
  });
}

test('no broken links in the whole output', () => assert.deepEqual(checkLinks(out), []));

test('full build: 3 directions × 89 pages + chooser, 0 broken links', async () => {
  const full = join(tmpdir(), 'grilloo-build-full');
  await build({ out: full });
  for (const d of ['etiquette', 'trace', 'rondeur']) assert.equal(walk(join(full, d)).filter((f) => f.endsWith('.html')).length, 89, d);
  const idx = join(full, 'index.html');
  assert.ok(existsSync(idx));
  const s = read(idx);
  for (const d of ['etiquette', 'trace', 'rondeur']) assert.match(s, new RegExp(`href="${d}/index.html"`));
  assert.match(s, /name="robots" content="noindex/);
  assert.deepEqual(checkLinks(full), []);
});
