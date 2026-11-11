import { escapeHtml, raw } from './html.mjs';
import { productBySlug, productsOf } from './data.mjs';

const BACKSLASH_LT = String.fromCharCode(92) + 'u003c'; // escapes < inside inline <script> JSON
export const INDEXABLE = false; // switch to true for the chosen direction (spec §3 SEO)

const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, BACKSLASH_LT)}</script>`;
const abs = (data, file) => `${data.site.domain}/${file === 'index.html' ? '' : file}`;

function breadcrumb(route, data) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: route.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(data, c.file) })) };
}
function organization(data) {
  return { '@context': 'https://schema.org', '@type': 'Organization', name: data.site.name, slogan: data.site.tagline, url: data.site.domain, description: data.brand.cover.text };
}
function product(route, data) {
  const p = productBySlug(data, route.params.slug);
  return {
    '@context': 'https://schema.org', '@type': 'Product', name: `GRILLOO ${p.name}`, sku: p.name, category: p.kind,
    brand: { '@type': 'Brand', name: 'GRILLOO' }, description: p.lead, image: abs(data, `assets/img/cut/${p.img}.webp`),
    additionalProperty: p.specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };
}
function itemList(items, data) {
  return { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(data, `produits/${p.slug}.html`), name: `GRILLOO ${p.name}` })) };
}
function howTo(data) {
  return { '@context': 'https://schema.org', '@type': 'HowTo', name: data.pages['guide-pierre'].h1, description: data.pages['guide-pierre'].intro, step: data.site.stoneSteps.map((s) => ({ '@type': 'HowToStep', position: s.n, name: s.title, text: s.text })) };
}

export function jsonLd(route, data) {
  const blocks = [breadcrumb(route, data)];
  if (route.kind === 'home') blocks.push(organization(data));
  if (route.kind === 'product') blocks.push(product(route, data));
  if (route.kind === 'catalogue') blocks.push(itemList(data.products, data));
  if (route.kind === 'gamme') blocks.push(itemList(productsOf(data, route.params.gamme), data));
  if (route.kind === 'guide-pierre') blocks.push(howTo(data));
  return blocks.map(ld).join('\n');
}

// Early motion flag: content hidden-before-reveal only when JS + motion allowed; auto-reverts if motion.js never confirms.
const MOTION_BOOT = `<script>(function(d){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-motion');setTimeout(function(){if(!window.GRILLOO_MOTION_READY)d.classList.remove('js-motion')},2500)})(document.documentElement);if(/[?&](eager|scroll=)/.test(location.search))document.addEventListener('DOMContentLoaded',function(){[].forEach.call(document.querySelectorAll('img[loading]'),function(i){i.loading='eager'})});var sm=/[?&]scroll=([0-9]+)/.exec(location.search);if(sm)document.addEventListener('DOMContentLoaded',function(){document.body.style.marginTop=(-sm[1])+'px'})</script>`;

// Script tags in dependency order, shared by every direction, followed by the direction's main.js.
export function scriptTags(ctx) {
  const files = ['vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js', 'vendor/SplitText.min.js', 'vendor/Flip.min.js', 'vendor/lenis.min.js',
    'js/grilloo-lib.js', 'js/motion.js', 'js/catalogue.js', 'js/compare.js', 'js/guide-ui.js', 'js/contact.js', 'main.js'];
  return raw(files.map((f) => `<script src="${ctx.asset(f)}" defer></script>`).join('\n'));
}
export function styleTags(ctx) {
  return raw(['vendor/lenis.css', 'fonts.css', 'style.css'].map((f) => `<link rel="stylesheet" href="${ctx.asset(f)}">`).join('\n'));
}

// <head> inner content shared by every direction. `extra` = direction-specific tags (fonts, css).
export function head({ route, data, ctx, extra = '' }) {
  const robots = INDEXABLE ? 'index, follow' : 'noindex, nofollow';
  return raw(`<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(route.title)}</title>
<meta name="description" content="${escapeHtml(route.description)}">
<meta name="robots" content="${robots}">
${INDEXABLE ? `<link rel="canonical" href="${abs(data, route.file)}">` : ''}
<meta property="og:type" content="${route.kind === 'product' ? 'product' : 'website'}">
<meta property="og:title" content="${escapeHtml(route.title)}">
<meta property="og:description" content="${escapeHtml(route.description)}">
<meta property="og:locale" content="fr_MA">
<meta name="theme-color" content="#ffffff">
${MOTION_BOOT}
<link rel="icon" href="${ctx.asset('img/brand/logo-mark-cyan.png')}">
${extra}
${jsonLd(route, data)}`);
}
