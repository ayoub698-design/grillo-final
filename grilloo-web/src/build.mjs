// Static site generator: every route × every direction → dist/<direction>/…
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { loadData } from './lib/data.mjs';
import { routes } from './lib/routes.mjs';
import { rel } from './lib/paths.mjs';
import { head, INDEXABLE } from './lib/seo.mjs';
import { raw } from './lib/html.mjs';

const BACKSLASH_LT = String.fromCharCode(92) + 'u003c'; // escapes < inside inline <script> JSON
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));
export const DIRECTIONS = ['etiquette', 'trace', 'rondeur'];

const VENDOR = ['gsap/dist/gsap.min.js', 'gsap/dist/ScrollTrigger.min.js', 'gsap/dist/SplitText.min.js', 'gsap/dist/Flip.min.js', 'lenis/dist/lenis.min.js', 'lenis/dist/lenis.css'];
const SHARED_JS = ['src/lib/guide.mjs', 'src/lib/catalogue-filter.mjs'];

// Pure ESM libs (no imports) → one classic script exposing window.GRILLOO.* (module scripts are blocked over file://).
export function libBundle() {
  const names = [];
  const code = SHARED_JS.map((f) => readFileSync(join(ROOT, f), 'utf8').replace(/^export\s+(const|function|let)\s+(\w+)/gm, (_, kw, name) => { names.push(name); return `${kw} ${name}`; })).join('\n');
  return `(function (root) {\n'use strict';\n${code}\nroot.GRILLOO = Object.assign(root.GRILLOO || {}, { ${names.join(', ')} });\n})(typeof window !== 'undefined' ? window : globalThis);\n`;
}

const write = (file, content) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, content); };

// Copies the latin + latin-ext woff2 faces of each @fontsource css entry and writes fonts.css.
function copyFonts(entries, assetsDir) {
  const css = [];
  for (const entry of entries) {
    const cssPath = require.resolve(entry);
    const blocks = readFileSync(cssPath, 'utf8').split(/(?=\/\* )/);
    for (const block of blocks) {
      const m = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/);
      if (!m || !/-latin(-ext)?-/.test(m[1])) continue;
      cpSync(join(dirname(cssPath), 'files', m[1]), join(assetsDir, 'fonts', m[1]));
      css.push(block.replace(/url\(\.\/files\/([^)]+\.woff2)\)[^;]*/, `url(fonts/$1) format('woff2')`).replace(/,?\s*url\(\.\/files\/[^)]+\.woff\)[^,;]*/g, '').trim());
    }
  }
  write(join(assetsDir, 'fonts.css'), css.join('\n\n'));
}

function copyAssets(dir, assetsDir) {
  for (const sub of ['img/cut', 'img/brand', 'img/gen']) {
    const from = join(ROOT, 'assets', sub);
    if (existsSync(from)) cpSync(from, join(assetsDir, sub), { recursive: true });
  }
  cpSync(join(ROOT, 'assets/catalogue-grilloo-2024.pdf'), join(assetsDir, 'catalogue-grilloo-2024.pdf'));
  for (const v of VENDOR) cpSync(require.resolve(v), join(assetsDir, 'vendor', basename(v)));
  for (const f of readdirSync(join(ROOT, 'src/client'))) cpSync(join(ROOT, 'src/client', f), join(assetsDir, 'js', f));
  write(join(assetsDir, 'js', 'grilloo-lib.js'), libBundle());
  const own = join(ROOT, 'src/directions', dir);
  for (const f of readdirSync(own)) {
    if (/\.(css|js)$/.test(f)) cpSync(join(own, f), join(assetsDir, f));
    if (f === 'img') cpSync(join(own, f), join(assetsDir, 'img', dir), { recursive: true });
  }
}

export function makeCtx(route, data, all) {
  const ctx = {
    data, route, routes: all,
    link: (to) => rel(route.file, to),
    asset: (p) => rel(route.file, `assets/${p}`),
    jsonScript: (id, obj) => raw(`<script type="application/json" id="${id}">${JSON.stringify(obj).replace(/</g, BACKSLASH_LT)}</script>`),
  };
  ctx.head = (extra = '') => head({ route, data, ctx, extra });
  return ctx;
}

export async function build({ directions = DIRECTIONS, out = join(ROOT, 'dist'), chooser = true } = {}) {
  // Empty the output dir (not the dir itself: OneDrive / open shells can lock it on Windows).
  // Only the directions being built are replaced, so `node src/build.mjs trace` keeps dist/etiquette.
  mkdirSync(out, { recursive: true });
  for (const d of directions) rmSync(join(out, d), { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
  const data = loadData();
  const all = routes(data);
  const built = [];
  for (const dir of directions) {
    const modPath = join(ROOT, 'src/directions', dir, 'index.mjs');
    if (!existsSync(modPath)) { console.warn(`skip ${dir}: not implemented`); continue; }
    const mod = await import(pathToFileURL(modPath).href);
    const base = join(out, dir);
    const assetsDir = join(base, 'assets');
    copyAssets(dir, assetsDir);
    copyFonts(mod.meta.fonts, assetsDir);
    for (const route of all) write(join(base, route.file), String(mod.renderPage(route, makeCtx(route, data, all))));
    write(join(base, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.map((r) => `  <url><loc>${data.site.domain}/${r.file === 'index.html' ? '' : r.file}</loc></url>`).join('\n')}\n</urlset>\n`);
    write(join(base, 'robots.txt'), INDEXABLE ? `User-agent: *\nAllow: /\nSitemap: ${data.site.domain}/sitemap.xml\n` : 'User-agent: *\nAllow: /\n# Maquettes : pages en noindex (meta robots)\n');
    built.push(mod.meta);
  }
  const chooserPath = join(ROOT, 'src/chooser.mjs');
  if (chooser && existsSync(chooserPath)) {
    const { renderChooser } = await import(pathToFileURL(chooserPath).href);
    renderChooser({ out, directions: built, data });
  }
  return built;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const t = Date.now();
  const built = await build(args.length ? { directions: args } : {});
  console.log(`built ${built.map((m) => m.id).join(', ') || 'nothing'} in ${Date.now() - t} ms`);
}
