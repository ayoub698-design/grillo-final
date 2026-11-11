# GRILLOO Web — 3 directions × 15 pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `grilloo-web/`, a static-site generator that outputs three complete, visually distinct GRILLOO catalogue sites (Étiquette, Trace, Rondeur). Each has 14 pages + 75 product pages, opens by double-click and deploys unchanged to Netlify/Vercel.

**Architecture:** Shared data (`data/*.json`) and shared logic (`src/lib/*.mjs`) feed a single build script. Each direction is a module exporting `meta` and `renderPage(page, ctx)` with its own templates, CSS and client JS. All links are relative `.html` paths; vendor libraries and fonts are copied locally.

**Tech Stack:** Node 26 (portable, `%LOCALAPPDATA%\nodejs-portable`), ES modules, `node:test`, vanilla HTML/CSS/JS, GSAP 3.15 (ScrollTrigger, SplitText, Flip), Lenis 1.3, @fontsource woff2, OpenAI Images API (`gpt-image-2.5-*` / `gpt-image-2`), Edge headless for screenshots.

**Spec:** `docs/superpowers/specs/2026-11-10-grilloo-web-3-directions-design.md`

## Global Constraints

- Project root: `C:\Users\asus\OneDrive\Desktop\griloo\grilloo-web\`. Work on branch `feat/grilloo-web` (repo is on `main`).
- PATH must include `$env:LOCALAPPDATA\nodejs-portable` (add it at the start of each shell).
- **Rien d'inventé** : every fact, figure and spec shown comes from `data/catalog.json`. No testimonials, client logos, invented counters, free-demo or response-time promises.
- When a product's text contradicts its spec table, the table wins (see `../directions/shared/data-issues.md`).
- Strip from displayed text: « JS Floor Systems », « Home Base », « ROND® », « PW 30/1 », « DT021 », « 510 ventilateur ».
- Brevets / EN IEC 63327 / ATEX / HEPA H13 / garantie batterie 5 ans appear only on the product page that states them, never in brand-level copy.
- Unknown contact data (adresse, téléphone, e-mail, horaires, WhatsApp, réseaux) renders as « À fournir par GRILLOO » from `data/site.json`.
- Machines are always shown with their catalogue cutouts (`assets/img/cut/<img>.png`). Generated images never depict a GRILLOO product, a logo, or legible text.
- French only. `<html lang="fr">`.
- Every generated page carries `<meta name="robots" content="noindex">` (until a direction is chosen).
- All internal `href`/`src` are relative and point to existing files. No CDN, no absolute `/` paths, no `fetch()` of local files (it fails over `file://`). Client data is inlined as `<script type="application/json">`.
- `prefers-reduced-motion: reduce` disables every animation (content visible immediately).
- Contrast AA for text. All interactive elements are keyboard-reachable with a visible focus state.
- **White Premium** (spec §5.0): white backgrounds, no dark full-width sections, cyan ≤ 5 % of a screen as punctuation only, sections spaced 160–240 px desktop / 96–128 px mobile, Lenis lerp 0.09, easing `cubic-bezier(0.22, 1, 0.36, 1)`, animate only transform/opacity/clip-path/filter. Each direction keeps its own durations: Étiquette 500–700 ms, Trace 1 000–1 400 ms, Rondeur 800–1 100 ms.
- Brand colours: cyan `#49B5BF`, sarcelle `#0D5560` (each direction's palette is in the spec §5, copy its hex values verbatim).
- Never write the OpenAI key to disk; read `[Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User')` and pass it as `OPENAI_API_KEY` to the process.

## Review Focus

1. **Opening over `file://` from a nested page** (`produits/g53.html`, `gammes/…`): CSS, JS, fonts, images and nav links must all resolve. → `check-links` test in Task 3 runs on every page depth.
2. **Guide de choix with odd input** (surface 0, empty, negative, huge like 200 000 m², hours 0): no crash, no `NaN`/`Infinity` on screen. Empty result shows a message + link to contact. → tests in Task 2.
3. **Products with missing key figures** (`productivity`/`width`/`energy` null, e.g. accessories like `gp10`, `sus304`, `compresseur`): pages, filters, comparator and range labels must render without "null", "undefined" or "NaN". → test in Task 1 (`rangeOf` ignores nulls) and in Task 3 (`dist` grep for `undefined|null|NaN` in visible text).
4. **Contact prefill with an unknown or hostile `?machine=` value** (`?machine=<script>`, `?machine=zzz`): field stays empty, nothing is injected. → test in Task 4.
5. **Reduced motion and no-JS**: with JS disabled or reduced motion, every section's content is visible (no element stuck at `opacity:0`). → Task 4 test asserts the reveal CSS is scoped under `.js-motion` (a class set by JS only when motion is allowed); screenshots with `-Reduce` in each direction task.

---

## File Structure

```
grilloo-web/
  package.json                 scripts: build, test, gen:images, shots
  data/
    catalog.json               75 products (from ../grilloo-catalogue/lib/catalog-data.json, cleaned)
    gammes.json                6 site ranges → catalogue families, intro copy
    sectors.json               6 sectors → product slugs
    site.json                  brand texts, nav, contact placeholders, PDF path
    pages.json                 shared editorial content per page id
  src/
    build.mjs                  orchestrator: clean dist, copy assets, render all routes × directions, sitemap/robots
    lib/
      data.mjs                 load + query data
      guide.mjs                guide de choix logic (also shipped to the browser)
      catalogue-filter.mjs     filter/sort logic (also shipped to the browser)
      routes.mjs               the 89 routes
      paths.mjs                relative path helpers
      html.mjs                 html`` tagged template with escaping, raw()
      seo.mjs                  <head> meta + JSON-LD builders
    client/                    browser modules shared by all directions (copied to assets/js/)
      motion.js                reduced-motion gate, Lenis + GSAP bootstrap, sets .js-motion
      catalogue.js             wires catalogue-filter to the DOM
      compare.js               comparator (localStorage, 2–3 items)
      guide-ui.js              wires guide.mjs to the form
      contact.js               ?machine= prefill (whitelisted), mailto fallback
    directions/
      etiquette/ index.mjs  layout.mjs  components.mjs  pages/*.mjs  style.css  main.js  icons.mjs
      trace/     (same shape)
      rondeur/   (same shape)
    chooser.mjs                dist/index.html (3 directions presentation)
  assets/
    img/cut/  img/brand/  img/gen/   fonts/  vendor/   catalogue-grilloo-2024.pdf
  scripts/
    prompts.json  gen-images.mjs  check-links.mjs  shot.ps1
  test/
    data.test.mjs  guide.test.mjs  filter.test.mjs  routes.test.mjs  html.test.mjs  build.test.mjs  contact.test.mjs
  dist/                        build output (gitignored)
```

---

### Task 1: Project scaffold and data layer

**Files:**
- Create: `grilloo-web/package.json`, `.gitignore` (`dist/`, `node_modules/`, `scripts/_shots/`), `data/catalog.json`, `data/gammes.json`, `data/sectors.json`, `data/site.json`, `data/pages.json`, `src/lib/data.mjs`
- Test: `test/data.test.mjs`

**Interfaces:**
- Produces (`src/lib/data.mjs`):
  - `loadData(): Data` where `Data = { brand, products: Product[], gammes: Gamme[], sectors: Sector[], site, pages }`
  - `Product` = catalogue product shape (`slug,name,family,kind,img,imgAlt,lead,description[],features[],accessories[],options[],specs[[k,v]],variants,key{productivity,width,tank,autonomy,power,weight,energy},sectors[],issues`) **plus** `gamme: string` (site range slug).
  - `Gamme = { slug, name, label, families: string[], intro: string[], criteria: string[], faq: [{q, a}] }` (6 items, slugs `autolaveuses, aspirateurs, balayeuses, traitement-des-sols, textiles-sechage, equipements-specialises`).
  - `Sector = { slug, name, intro, products: string[] }` (6 items: `sante, logistique, industrie, commerce, hotellerie, collectivites`).
  - `productsOf(data, gammeSlug): Product[]`, `productBySlug(data, slug): Product|undefined`, `related(data, product, n=4): Product[]` (same gamme, closest productivity), `rangeOf(products, keyName): {min, max}|null` (ignores null/undefined/NaN, returns null when none).
- `energy` values: `'batterie' | 'secteur' | 'manuel' | 'thermique' | 'pneumatique' | null`.

- [ ] **Step 1: Create branch and scaffold**

Run (PowerShell, repo root): `git checkout -b feat/grilloo-web`, then create `grilloo-web/` with `package.json` (`"type":"module"`, scripts `"test": "node --test test/"`, `"build": "node src/build.mjs"`, `"gen:images": "node scripts/gen-images.mjs"`), devDependencies `gsap@3.15.1`, `lenis@1.3.27`, `@fontsource-variable/host-grotesk`, `@fontsource/barlow-condensed`, `@fontsource-variable/hanken-grotesk`, `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/unbounded`, `@fontsource-variable/inter-tight`. Run `npm install`.
Expected: `node_modules/gsap/dist/gsap.min.js` exists.

- [ ] **Step 2: Build the data files**

`catalog.json` = `products` of `../grilloo-catalogue/lib/catalog-data.json`, applying the Global Constraints: strip the third-party mentions from `lead`/`description`/`features`; where `data-issues.md` names a text/table conflict, rewrite the text value to the table's value. Add `gamme` to each product via the mapping in spec §3 (`autolaveuses`+`autoportees` → `autolaveuses`; `monobrosses`+`polisseuses` → `traitement-des-sols`; `injecteurs`+`souffleurs` → `textiles-sechage`; `escalators`+`equipements` → `equipements-specialises`; `aspirateurs`, `balayeuses` unchanged). `gammes.json` intros come from catalogue p. 3 and p. 26 (via `families[].intro/introLong`). `criteria` and `faq` answers must be derivable from catalog values (FAQ answers are templates filled at render time, e.g. `{"q":"Quelle autonomie ?","a":"De {autonomy.min} à {autonomy.max} h selon le modèle."}`). `sectors.json` maps each sector to products whose `sectors[]` mentions it. `site.json` holds brand texts (`headline`, `backCover`, `cover.text`, `intro`, objective, the 7 engagements with catalogue p. 4–5 text) and contact fields set to `"À fournir par GRILLOO"`. `pages.json` holds per page id `{ title, description, h1, intro, sections: {...} }` with copy taken from the catalogue only.

- [ ] **Step 3: Write the failing tests** (`test/data.test.mjs`)

```js
test('75 products, each with a known gamme', () => {
  const d = loadData();
  assert.equal(d.products.length, 75);
  const g = new Set(d.gammes.map(x => x.slug));
  assert.equal(g.size, 6);
  for (const p of d.products) assert.ok(g.has(p.gamme), p.slug);
});
test('no third-party mention in displayed text', () => {
  const txt = JSON.stringify(loadData().products.map(p => [p.lead, p.description, p.features]));
  for (const bad of ['JS Floor', 'Home Base', 'ROND®', 'PW 30/1', 'DT021', '510 ventilateur']) assert.ok(!txt.includes(bad), bad);
});
test('rangeOf ignores nulls and returns null when empty', () => {
  assert.deepEqual(rangeOf([{key:{productivity:1200}},{key:{productivity:null}},{key:{productivity:12000}}], 'productivity'), {min:1200,max:12000});
  assert.equal(rangeOf([{key:{productivity:null}}], 'productivity'), null);
});
test('autolaveuses range is 1200–12000 m²/h', () => {
  const d = loadData();
  assert.deepEqual(rangeOf(productsOf(d, 'autolaveuses'), 'productivity'), {min:1200, max:12000});
});
test('every sector lists existing products', () => {
  const d = loadData();
  for (const s of d.sectors) { assert.ok(s.products.length > 0, s.slug); for (const slug of s.products) assert.ok(productBySlug(d, slug), slug); }
});
test('related() excludes the product itself and stays in gamme', () => {
  const d = loadData(); const p = productBySlug(d, 'g53'); const r = related(d, p);
  assert.ok(r.length > 0 && r.every(x => x.slug !== 'g53' && x.gamme === p.gamme));
});
```

- [ ] **Step 4: Run tests — expect FAIL** (`npm test`, "Cannot find module ../src/lib/data.mjs").
- [ ] **Step 5: Implement `src/lib/data.mjs`** (read JSON with `fs.readFileSync` relative to `import.meta.url`).
- [ ] **Step 6: Run tests — expect PASS.**
- [ ] **Step 7: Commit** — `git add grilloo-web && git commit -m "feat(grilloo-web): scaffold and cleaned catalogue data"`

---

### Task 2: Guide de choix and catalogue filter logic

**Files:**
- Create: `src/lib/guide.mjs`, `src/lib/catalogue-filter.mjs`
- Test: `test/guide.test.mjs`, `test/filter.test.mjs`

**Interfaces:**
- Produces:
  - `recommend(products, { surfaceType, area, hours, energy, cluttered }): { needed: number|null, items: Product[], note: string }`
    - `surfaceType`: `'dur' | 'textile' | 'exterieur' | 'escalator'` → gammes/families: `dur` → autolaveuses + traitement-des-sols; `textile` → injecteurs + aspirateurs `gsb2`,`gsb660`; `exterieur` → balayeuses; `escalator` → escalators.
    - `needed = area / hours` rounded up, or `null` when `area` or `hours` is not a finite number > 0.
    - items: products of the matching families with `key.productivity >= needed` (if `needed` is null: all of them), `energy` filter when not `'indifferent'`, `cluttered === true` prefers `key.width <= 600` (sort those first). Sort by productivity ascending (smallest sufficient machine first), max 6.
    - `note` is the fixed string « Estimation indicative basée sur les rendements théoriques du catalogue. »
  - `filterProducts(products, { gamme, energy, minProductivity, q, sort }): Product[]`. `q` matches name, kind, lead, case- and accent-insensitive. `sort`: `'nom' | 'rendement-asc' | 'rendement-desc'`. Products with null productivity sort last.
- Both modules are pure ES modules with no Node imports (shipped to the browser in Task 3).

- [ ] **Step 1: Write the failing tests**

```js
// guide.test.mjs
test('1 500 m² in 1 h on hard floor → only machines ≥ 1 500 m²/h, smallest first', () => {
  const r = recommend(d.products, { surfaceType:'dur', area:1500, hours:1, energy:'indifferent', cluttered:false });
  assert.equal(r.needed, 1500);
  assert.ok(r.items.length > 0 && r.items.every(p => p.key.productivity >= 1500));
  assert.ok(r.items[0].key.productivity <= r.items.at(-1).key.productivity);
});
for (const area of [0, -5, NaN, undefined, '']) test(`area=${area} gives needed=null, no throw`, () => {
  const r = recommend(d.products, { surfaceType:'dur', area, hours:1 });
  assert.equal(r.needed, null); assert.ok(Array.isArray(r.items));
});
test('hours 0 gives needed=null', () => assert.equal(recommend(d.products,{surfaceType:'dur',area:100,hours:0}).needed, null));
test('200 000 m² in 1 h → empty items, no throw', () => assert.equal(recommend(d.products,{surfaceType:'dur',area:200000,hours:1}).items.length, 0));
test('exterieur returns only balayeuses', () => assert.ok(recommend(d.products,{surfaceType:'exterieur',area:5000,hours:1}).items.every(p=>p.gamme==='balayeuses')));
// filter.test.mjs
test('q is accent-insensitive', () => assert.ok(filterProducts(d.products,{q:'autoportee'}).length >= 8));
test('gamme filter', () => assert.ok(filterProducts(d.products,{gamme:'balayeuses'}).every(p=>p.gamme==='balayeuses')));
test('rendement-desc puts nulls last', () => { const r = filterProducts(d.products,{sort:'rendement-desc'}); assert.equal(r.at(-1).key.productivity ?? null, null); });
```

- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement both modules** (accent folding via `normalize('NFD').replace(/\p{Diacritic}/gu,'')`).
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** — `feat(grilloo-web): guide de choix and catalogue filter logic`

---

### Task 3: Build pipeline, routes, SEO, link checker

**Files:**
- Create: `src/lib/routes.mjs`, `src/lib/paths.mjs`, `src/lib/html.mjs`, `src/lib/seo.mjs`, `src/build.mjs`, `scripts/check-links.mjs`, `src/directions/_stub/index.mjs` (test-only direction)
- Test: `test/routes.test.mjs`, `test/html.test.mjs`, `test/build.test.mjs`

**Interfaces:**
- Consumes: `loadData`, `productsOf`, `productBySlug` (Task 1); `guide.mjs`, `catalogue-filter.mjs` (Task 2, copied verbatim to `dist/<dir>/assets/js/`).
- Produces:
  - `routes(data): Route[]`, `Route = { id, file, kind, title, description, crumbs: [{label, file}], params }`. `kind ∈ home, catalogue, product, gamme, robot, secteurs, guide, guide-pierre, about, contact`. Files exactly as the spec §3 URL table. Product routes: `produits/<slug>.html`, `params.slug`. Gamme routes: `params.gamme`.
  - `rel(fromFile, toFile): string` (e.g. `rel('produits/g53.html','gammes/autolaveuses.html') === '../gammes/autolaveuses.html'`; `rel('index.html','index.html') === 'index.html'`).
  - `html` tagged template: interpolated strings are HTML-escaped; arrays joined; `raw(str)` bypasses escaping.
  - `head({ route, data, ctx }): string` → title, description, robots noindex, OG tags, JSON-LD (`Organization` on home, `BreadcrumbList` everywhere, `Product` on product pages without `offers`, `HowTo` on guide-pierre, `ItemList` on catalogue/gamme).
  - `ctx = { data, route, link(toFile), asset(path), jsonScript(id, obj) }`. `link`/`asset` return paths relative to the current route's file; assets live at `dist/<direction>/assets/…`.
  - Direction module contract: `export const meta = { id, name, fonts: string[] /* @fontsource package names */ }` and `export function renderPage(route, ctx): string` (full document). Its `style.css`, `main.js` and optional `img/` are copied to `dist/<id>/assets/`.
  - `build({ directions: string[] = ['etiquette','trace','rondeur'], out = 'dist' })`: cleans the out dir, copies `assets/` (cut, brand, gen, PDF), vendor files (`gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `Flip.min.js`, `lenis.min.js`, `lenis.css`), fonts (woff2 + generated `fonts.css` with relative `url()`), client modules, and writes every route for each direction plus `sitemap.xml` and `robots.txt` per direction. CLI: `node src/build.mjs [direction…]` (directions not yet implemented are skipped with a warning).
  - `checkLinks(dir): string[]` returns the list of broken refs (`file → ref`). It parses `href`, `src`, `srcset` and CSS `url()`, ignores `http(s):`, `mailto:`, `tel:`, `#…`, `data:` and strips `?…`/`#…`.

- [ ] **Step 1: Write the failing tests**

```js
// routes.test.mjs
test('89 routes, unique files', () => { const r = routes(loadData()); assert.equal(r.length, 89); assert.equal(new Set(r.map(x=>x.file)).size, 89); });
test('rel', () => {
  assert.equal(rel('produits/g53.html','gammes/autolaveuses.html'), '../gammes/autolaveuses.html');
  assert.equal(rel('index.html','assets/style.css'), 'assets/style.css');
});
// html.test.mjs
test('escapes interpolations, raw passes through', () => {
  assert.equal(html`<p>${'<b>'}</p>`, '<p>&lt;b&gt;</p>');
  assert.equal(html`<p>${raw('<b>')}</p>`, '<p><b></p>');
  assert.equal(html`<ul>${['a','b'].map(x => html`<li>${x}</li>`)}</ul>`, '<ul><li>a</li><li>b</li></ul>');
});
// build.test.mjs  (uses the _stub direction, out = os.tmpdir()/grilloo-test)
test('stub build writes 89 pages + sitemap and has no broken links', () => {
  build({ directions:['_stub'], out });
  assert.equal(globSync(`${out}/_stub/**/*.html`).length, 89);
  assert.ok(existsSync(`${out}/_stub/sitemap.xml`));
  assert.deepEqual(checkLinks(out), []);
});
test('every page is noindex and has one h1', () => { for (const f of pages) { const s = read(f); assert.match(s, /name="robots" content="noindex"/); assert.equal((s.match(/<h1[\s>]/g)||[]).length, 1); } });
test('product page has Product JSON-LD without offers', () => { const s = read(`${out}/_stub/produits/g53.html`); assert.match(s, /"@type":"Product"/); assert.doesNotMatch(s, /"offers"/); });
test('no undefined/null/NaN leaks into visible text', () => { for (const f of pages) assert.doesNotMatch(stripTags(read(f)), /\b(undefined|null|NaN)\b/, f); });
```

Nested `html` results must not be re-escaped (they return a marked string, like `raw`). The `_stub` direction renders `head()`, an `<h1>` with `route.title`, a nav linking to every non-product route, and for product routes the spec rows; it is enough to exercise links at every depth.

- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** `routes.mjs`, `paths.mjs` (`path.posix.relative` on dirnames), `html.mjs`, `seo.mjs`, `build.mjs`, `check-links.mjs` (also runnable as CLI: exits 1 and prints broken refs).
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** — `feat(grilloo-web): build pipeline, routes, SEO and link checker`

---

### Task 4: Shared client modules (motion, catalogue, comparator, guide UI, contact)

**Files:**
- Create: `src/client/motion.js`, `src/client/catalogue.js`, `src/client/compare.js`, `src/client/guide-ui.js`, `src/client/contact.js`
- Test: `test/contact.test.mjs`

**Interfaces:**
- Consumes: `filterProducts`, `recommend` (imported as `./catalogue-filter.mjs`, `./guide.mjs` inside `dist/<dir>/assets/js/`).
- Produces (DOM contract every direction must follow):
  - `motion.js` → `export function initMotion({ smooth = true } = {}): { gsap, ScrollTrigger, lenis, reduced: boolean }`. Adds `html.js-motion` only when JS runs and `reduced` is false. Directions scope every hidden-before-reveal style under `.js-motion` so content is visible without JS or with reduced motion.
  - Catalogue data: `<script type="application/json" id="catalogue-data">` (slim products: slug, name, kind, gamme, img, key, file). Markup hooks: `[data-catalogue]` root, `[data-filter="gamme|energy|q|sort|minProductivity"]` inputs, `[data-results]` container, `[data-count]`. `catalogue.js` exports `initCatalogue({ renderCard: (p) => string })` (each direction supplies its card template).
  - Comparator: `[data-compare-add="<slug>"]` buttons, `[data-compare-bar]` tray, storage key `grilloo-compare` (try/catch around localStorage, max 3). `compare.js` exports `initCompare({ renderTable: (products) => string })`.
  - Guide: `[data-guide]` form with fields `surfaceType, area, hours, energy, cluttered`, `[data-guide-results]`, `[data-guide-needed]`. `guide-ui.js` exports `initGuide({ renderItem: (p) => string, emptyHtml: string })`. Display rounds `needed` with `toLocaleString('fr-FR')`.
  - Contact: form `[data-contact]` with `name="machine"` select listing all product names (value = slug). `contact.js` exports `prefillMachine(search: string, slugs: string[]): string` (returns the slug only if it is in `slugs`, else `''`) and `initContact()` (applies prefill, sets `data-netlify="true"` already in markup; on `file:` protocol, the submit handler builds a `mailto:` with the form fields).

- [ ] **Step 1: Write the failing test** (`test/contact.test.mjs`)

```js
test('prefill whitelists slugs', () => {
  assert.equal(prefillMachine('?machine=g53', ['g53','gb3']), 'g53');
  assert.equal(prefillMachine('?machine=zzz', ['g53']), '');
  assert.equal(prefillMachine('?machine=%3Cscript%3E', ['g53']), '');
  assert.equal(prefillMachine('', ['g53']), '');
});
test('reveal styles are gated by .js-motion in every direction CSS', () => {
  for (const css of directionCssFiles()) for (const rule of rulesWith(css, /opacity:\s*0/)) assert.match(rule.selector, /\.js-motion/, `${css}: ${rule.selector}`);
});
```

(`directionCssFiles()` returns the existing `src/directions/*/style.css` (skip `_stub`); the second test passes vacuously now and guards Tasks 5–13.)

- [ ] **Step 2: Run — expect FAIL** (module missing).
- [ ] **Step 3: Implement the five modules** (`prefillMachine` must be importable in Node: no top-level DOM access).
- [ ] **Step 4: Run — expect PASS.** Also extend the `_stub` direction to include `motion.js` and verify `node src/build.mjs _stub` + `node scripts/check-links.mjs dist` prints `0 broken`.
- [ ] **Step 5: Commit** — `feat(grilloo-web): shared client modules`

---

### Task 5: Visual assets (copy, generate, screenshot tool)

**Files:**
- Create: `assets/img/cut/*` (copy of `../grilloo-catalogue/public/img/cut`), `assets/img/brand/*` (copy of `…/img/brand`), `assets/catalogue-grilloo-2024.pdf`, `scripts/prompts.json`, `scripts/gen-images.mjs`, `assets/img/gen/*`, `scripts/shot.ps1` (copy of `../grilloo-catalogue/scripts/shot.ps1`, `-Base` accepts a `file:///…/dist` URL)

**Interfaces:**
- Produces: `assets/img/gen/<id>.(jpg|png)` with ids:
  - ambiances: `amb-clinique, amb-entrepot, amb-mall, amb-hotel, amb-agro, amb-gare, amb-parking, amb-escalator` (1536×1024, jpg q82)
  - textures (Trace): `tex-beton-sale, tex-beton-propre, tex-terrazzo-sale, tex-terrazzo-propre, tex-marbre-sale, tex-marbre-propre` (1536×1024, same framing per pair)
  - objets ronds (Rondeur): `obj-disque-brosse, obj-pad, obj-plateau, obj-goutte, obj-ecume, obj-brosse-laterale` (1024×1024 PNG, `background: transparent`)
  - matières: `mat-metal-brosse, mat-polymere, mat-eau-sol-poli` (1536×1024)
- `gen-images.mjs [--only id,…] [--model name] [--force]`: reads `prompts.json` (`[{id, prompt, size, background?, format}]`), calls `POST https://api.openai.com/v1/images/generations` with `quality: "high"`, writes the file, skips existing files unless `--force`, logs failures and continues. Model default: first that succeeds of `gpt-image-2.5-flare`, `gpt-image-2`.

- [ ] **Step 1: Copy brand, cutouts and PDF; write `prompts.json`** (each prompt states: photographic, contemporary Morocco, no people facing camera, no text, no logos, no cleaning machine in frame; all high-key and bright; floors: light marble/terrazzo/pale polished concrete, top-down, identical framing, the "sale" variant dusty and dull but never dark).
- [ ] **Step 2: Model trial** — run `node scripts/gen-images.mjs --only amb-hotel --model gpt-image-2.5-flare` then `--model gpt-image-2 --force` into a temp name; view both with Read; keep the better model as default in the script.
- [ ] **Step 3: Generate all 23** — `node scripts/gen-images.mjs`. Expected: 23 files in `assets/img/gen/`, script prints `23 ok, 0 failed`.
- [ ] **Step 4: Review every image** with Read. Regenerate (`--only id --force`) any with text, logos, deformed objects, a machine in frame, or a mismatched texture pair.
- [ ] **Step 5: Commit** — `feat(grilloo-web): brand, product and generated visual assets`

---

### Tasks 6–8: Direction 1 « Étiquette »

Design reference: spec §5.0 + Direction 1 (palette, Host Grotesk + Barlow Condensed labels, hairlines with 60° triangular notch, white paper index tabs, dotted tear line, fine ink label chips, sticky tabs with Flip indicator, spec-sheet product page, line-mask title reveals, hairline drawing, spec row ↔ photo dimension link, arrow-push buttons; ambiance photos high-key in natural colour). Icons: `icons.mjs` exports `icon(name): string` (inline SVG, 1.25 px sharp-cornered stroke) for the 6 gammes, 6 sectors, 7 engagements, units (m²/h, L, kg, h, V, W).

Common verification for each of tasks 6–8:
- `npm test` passes (includes the `.js-motion` CSS guard and the no-`undefined` check, now run against the real direction by `build.test.mjs` parametrised over implemented directions).
- `node src/build.mjs etiquette && node scripts/check-links.mjs dist` → `0 broken`.
- Screenshots: `powershell -File scripts\shot.ps1 -Base 'file:///C:/Users/asus/OneDrive/Desktop/griloo/grilloo-web/dist/etiquette' -Out scripts\_shots\etiquette -Pages '/index.html|1440x5200', …` plus `-Mobile` at 390 and `-Reduce`. Read every screenshot; fix overflow, overlap, unreadable contrast, empty blocks, before committing.

### Task 6: Étiquette — layout, components, Accueil

**Files:** Create `src/directions/etiquette/{index.mjs, layout.mjs, components.mjs, icons.mjs, style.css, main.js, pages/home.mjs}`

**Interfaces:**
- Consumes: `head`, `ctx`, `html`, `raw` (Task 3); client modules (Task 4); data queries (Task 1).
- Produces: `layout(route, ctx, bodyHtml): string` (skip-link, header with mega-menu of 6 gammes, mobile menu, footer, scripts as `type="module"`), components: `label(text)`, `productCard(p, ctx)`, `specTable(rows)`, `keyFigures(p)`, `tabIndex(items)`, `cta(ctx)`, divider SVGs `cutOblique()`, `tearLine()`, `tabEdge()`.

- [ ] **Step 1:** Implement layout, components, icons and `style.css` design tokens (spec §5 hex values verbatim).
- [ ] **Step 2:** Implement `pages/home.mjs` with the 8 home blocks of spec §4.1; range figures computed with `rangeOf`.
- [ ] **Step 3:** Implement `main.js` (calls `initMotion()`; label print reveal, horizontal range rail with ScrollTrigger pin, triangle travel, arrow buttons). Other routes temporarily render a minimal page through `layout` so links resolve.
- [ ] **Step 4:** Run the common verification on `index.html` (desktop, mobile, reduced).
- [ ] **Step 5: Commit** — `feat(etiquette): layout, components and home`

### Task 7: Étiquette — Catalogue, Fiche produit, 6 gammes, RoboClean G+

**Files:** Create `src/directions/etiquette/pages/{catalogue.mjs, product.mjs, gamme.mjs, robot.mjs}`

- [ ] **Step 1:** Catalogue page using `initCatalogue({renderCard})` and `initCompare({renderTable})` (inline `catalogue-data`), filters per spec §4.2.
- [ ] **Step 2:** Product page per spec §4.3 (spec-sheet layout, sticky tab nav: Aperçu / Caractéristiques / Accessoires / Variantes / Associés; CTA `contact.html?machine=<slug>`; PDF link). Verify 3 contrasting products: `g53` (full data), `gs60` (variants), `sus304` (sparse key figures).
- [ ] **Step 3:** Gamme page per spec §4.4 (intro, criteria, product list with comparable figures, mini comparison, FAQ filled from `rangeOf`).
- [ ] **Step 4:** RoboClean G+ page per spec §4.5.
- [ ] **Step 5:** Common verification on `catalogue.html`, `produits/g53.html`, `produits/sus304.html`, `gammes/autolaveuses.html`, `robotclean-g-plus.html`.
- [ ] **Step 6: Commit** — `feat(etiquette): catalogue, product, ranges, RoboClean`

### Task 8: Étiquette — Secteurs, Guide de choix, Guide pierre, À propos, Contact

**Files:** Create `src/directions/etiquette/pages/{secteurs.mjs, guide.mjs, guide-pierre.mjs, about.mjs, contact.mjs}`

- [ ] **Step 1:** Secteurs (anchors per sector, product cards from `sectors.json`, ambiance images).
- [ ] **Step 2:** Guide de choix with `initGuide`; manually check in the built page: area `1500`/hours `1` shows results; area `0` and `200000` show the empty message with a contact link, never `NaN`.
- [ ] **Step 3:** Guide pierre (7 steps of spec §4.8, `HowTo` JSON-LD via `head`, linked machines).
- [ ] **Step 4:** À propos (spec §4.9; honest guarantee wording) and Contact (spec §4.10 fields; `initContact`; open `contact.html?machine=g53` and confirm the select shows G53).
- [ ] **Step 5:** Common verification on these 5 pages, then open `dist/etiquette/index.html` in the default browser (`Start-Process`) for the client.
- [ ] **Step 6: Commit** — `feat(etiquette): sectors, guides, about, contact`

---

### Tasks 9–11: Direction 2 « Trace »

Same file shape under `src/directions/trace/`, same page split and same common verification as Tasks 6–8 (replace `etiquette` with `trace`). Design reference: spec §5.0 + Direction 2 (white/mist base, light floors only). Signature implementations:
- Hero squeegee reveal: `<canvas>`: the `tex-*-propre` (gleaming) image sits under a canvas painted with the `tex-*-sale` (dusty haze) image; pointer/touch erases the haze along a curved squeegee stroke whose width scales with viewport; erased alpha regrows slowly (requestAnimationFrame, capped at 30 fps). Reduced motion or no JS → the clean texture with a static diagonal clean band.
- Dividers: `squeegeeArc()`, `wetTrail()`, `reflectionLine()`.
- Work-width bands: each product card/fiche shows a bar whose width = `key.width / 1360 × 100%` (1360 mm = largest working width in catalogue); hidden when `key.width` is null.
- Before/after slider with squeegee handle (keyboard: arrow keys move it 5 %).
- Drop on CTA hover, defog reveal of headlines and images (blur 12 px + white veil → sharp), reflection following the cursor on cards. Display type in Hanken Grotesk 200–300.

- [ ] **Task 9 — layout, components, Accueil** (steps as Task 6). Commit `feat(trace): layout, components and home`.
- [ ] **Task 10 — Catalogue, Fiche, gammes, RoboClean** (steps as Task 7). Commit `feat(trace): catalogue, product, ranges, RoboClean`.
- [ ] **Task 11 — Secteurs, guides, À propos, Contact** (steps as Task 8; the guide is laid out as successive "passes"). Commit `feat(trace): sectors, guides, about, contact`.

---

### Tasks 12–14: Direction 3 « Rondeur »

Same file shape under `src/directions/rondeur/`, same split and verification. Design reference: spec §5.0 + Direction 3 (white base, no full-page cyan; cyan only in crisp discs; Unbounded 300–500). Signature implementations:
- Discs whose rotation is tied to scroll velocity (`lenis.on('scroll', e => …e.velocity)`), easing back to an idle spin.
- Product "hublots" (circular mask) with key figures positioned on an orbit (CSS `rotate()/translate()` per item, counter-rotated labels).
- Circular carousel of the 6 gammes (keyboard arrows + buttons; `aria-roledescription="carrousel"`).
- Circular text around the devis CTA (SVG `textPath`).
- Iris page transitions: on internal link click, a fixed circle clip-path closes, then navigation; on load it opens. Skipped under reduced motion and for modified clicks (ctrl/cmd/middle), `target`, downloads and `#` links.
- Dividers: `porthole()`, `scallopEdge()` (hairline), `circleChain()` (hairline).
- Magnetic buttons (pointer-fine devices only).

- [ ] **Task 12 — layout, components, Accueil.** Commit `feat(rondeur): layout, components and home`.
- [ ] **Task 13 — Catalogue, Fiche, gammes, RoboClean.** Commit `feat(rondeur): catalogue, product, ranges, RoboClean`.
- [ ] **Task 14 — Secteurs, guides, À propos, Contact.** Commit `feat(rondeur): sectors, guides, about, contact`.

---

### Task 15: Chooser page, README, final verification

**Files:**
- Create: `src/chooser.mjs` (renders `dist/index.html`), `grilloo-web/README.md`
- Modify: `src/build.mjs` (call chooser after directions), `test/build.test.mjs` (full build assertions)

**Interfaces:**
- Consumes: `build()` (Task 3), the three direction `meta` objects.

- [ ] **Step 1: Write the failing test**

```js
test('full build: 3 × 89 pages + chooser, 0 broken links', () => {
  build({ out });
  for (const d of ['etiquette','trace','rondeur']) assert.equal(globSync(`${out}/${d}/**/*.html`).length, 89);
  assert.ok(existsSync(`${out}/index.html`));
  assert.deepEqual(checkLinks(out), []);
});
```

- [ ] **Step 2: Run — expect FAIL** (no chooser).
- [ ] **Step 3: Implement the chooser** (neutral page: GRILLOO logo, the 3 directions with name, one-line idea, typography sample, palette chips, a home screenshot taken in Tasks 8/11/14 and copied to `assets/img/chooser/`, link to each `index.html`).
- [ ] **Step 4: Write README** (open `dist/index.html` by double-click; rebuild `npm run build`; deploy: drag `dist/` onto Netlify or `vercel deploy dist`; switching the chosen direction to `index`; list of HD photos to request per product; link to `../directions/shared/data-issues.md` points to confirm).
- [ ] **Step 5: Run full verification** — `npm test` (all PASS), `npm run build`, `node scripts/check-links.mjs dist` (`0 broken`), screenshot the chooser at 1440 and 390, then `Start-Process dist\index.html`.
- [ ] **Step 6: Commit** — `feat(grilloo-web): chooser page and README`
