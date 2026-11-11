import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { libBundle } from '../src/build.mjs';

await import('../src/client/contact.js');
const { prefillMachine } = globalThis.GRILLOO;

test('prefill whitelists slugs', () => {
  assert.equal(prefillMachine('?machine=g53', ['g53', 'gb3']), 'g53');
  assert.equal(prefillMachine('?machine=zzz', ['g53']), '');
  assert.equal(prefillMachine('?machine=%3Cscript%3E', ['g53']), '');
  assert.equal(prefillMachine('?machine=%E0%A4%A', ['g53']), '');
  assert.equal(prefillMachine('', ['g53']), '');
});

test('libBundle is a classic script exposing GRILLOO.recommend and filterProducts', () => {
  const ctx = { window: {} };
  vm.runInNewContext(libBundle(), ctx);
  assert.equal(typeof ctx.window.GRILLOO.recommend, 'function');
  assert.equal(typeof ctx.window.GRILLOO.filterProducts, 'function');
  assert.doesNotMatch(libBundle(), /^\s*export\s/m);
});

test('client scripts are classic (no import/export statements)', () => {
  for (const f of readdirSync(new URL('../src/client/', import.meta.url))) {
    const s = readFileSync(new URL(`../src/client/${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(s, /^\s*(import|export)\s/m, f);
  }
});

// Guard for Tasks 6–14: hidden-before-reveal styles must only apply when JS enabled motion.
const cssFiles = ['etiquette', 'trace', 'rondeur'].map((d) => new URL(`../src/directions/${d}/style.css`, import.meta.url)).filter((u) => existsSync(u));
function rulesWithOpacity0(css) {
  const out = [];
  const flat = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of flat.matchAll(/([^{}]+)\{([^{}]*)\}/g)) if (/(^|;)\s*opacity:\s*0\s*(;|$)/.test(m[2])) out.push(m[1].trim());
  return out;
}
test('reveal styles (opacity:0) are gated by .js-motion', () => {
  for (const u of cssFiles) for (const sel of rulesWithOpacity0(readFileSync(u, 'utf8'))) {
    for (const part of sel.split(',')) assert.match(part.trim(), /^(\d+%|from|to)$|\.js-motion|:not\(|::?(before|after)|\[hidden\]|\.is-|dialog|:hover|:focus/, `${u.pathname}: ${part}`);
  }
});

test('formLines uses the short label, skips consent/hidden fields and empty values', () => {
  const { formLines } = globalThis.GRILLOO;
  const lines = formLines([
    { name: 'type', label: 'Type de demande', value: 'Devis', text: 'Devis', type: 'select-one' },
    { name: 'machine', label: 'Machine', value: 'g53', text: 'G53 — Autolaveuse', type: 'select-one' },
    { name: 'surface', label: 'Surface (m²)', value: '', text: '', type: 'number' },
    { name: 'consentement', label: 'J’accepte…', value: 'on', type: 'checkbox', checked: true },
    { name: 'form-name', label: '', value: 'devis', type: 'hidden' },
  ]);
  assert.deepEqual(lines, ['Type de demande : Devis', 'Machine : G53 — Autolaveuse']);
});
