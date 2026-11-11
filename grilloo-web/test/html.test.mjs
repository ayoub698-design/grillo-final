import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, raw } from '../src/lib/html.mjs';

test('escapes interpolations', () => assert.equal(String(html`<p>${'<b>&"'}</p>`), '<p>&lt;b&gt;&amp;&quot;</p>'));
test('raw passes through', () => assert.equal(String(html`<p>${raw('<b>')}</p>`), '<p><b></p>'));
test('nested html and arrays are not re-escaped', () => {
  assert.equal(String(html`<ul>${['a', 'b'].map((x) => html`<li>${x}</li>`)}</ul>`), '<ul><li>a</li><li>b</li></ul>');
});
test('null, undefined and false render nothing; numbers render', () => {
  assert.equal(String(html`<i>${null}${undefined}${false}${0}</i>`), '<i>0</i>');
});

test('inline JSON (jsonScript and JSON-LD) cannot close its <script> tag', async () => {
  const { makeCtx } = await import('../src/build.mjs');
  const { jsonLd } = await import('../src/lib/seo.mjs');
  const { loadData } = await import('../src/lib/data.mjs');
  const { routes } = await import('../src/lib/routes.mjs');
  const data = loadData(); const all = routes(data);
  const s = String(makeCtx(all[0], data, all).jsonScript('x', { a: '</script><b>' }));
  assert.equal(s.match(/<\/script>/g).length, 1);
  const p = all.find((r) => r.kind === 'product');
  const ld = jsonLd({ ...p, title: '</script>' }, { ...data, pages: data.pages });
  assert.doesNotMatch(ld.replace(/<\/script>(\n|$)/g, ''), /<\/script>/);
});
