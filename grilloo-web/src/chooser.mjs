// dist/index.html — neutral presentation of the three directions.
import { writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, raw } from './lib/html.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const SPEC = {
  etiquette: { n: '01', font: "'Host Grotesk Variable'", label: "'Barlow Condensed'", tempo: 'Staccato · 500–700 ms', type: 'Host Grotesk + Barlow Condensed', palette: ['#FFFFFF', '#F6F7F7', '#0F1214', '#49B5BF'], bits: ['Cartels et filets fins', 'Encoche triangulaire à 60°', 'Fiche technique, cotes reliées à la photo'] },
  trace: { n: '02', font: "'Hanken Grotesk Variable'", label: "'JetBrains Mono Variable'", tempo: 'Ample · 1 000–1 400 ms', type: 'Hanken Grotesk + JetBrains Mono', palette: ['#FFFFFF', '#F3F6F7', '#1A1F21', '#3FB6C2'], bits: ['Buée dissipée au curseur', 'Bandes à l’échelle de la largeur de travail', 'Reflets au sol, arcs de raclette'] },
  rondeur: { n: '03', font: "'Unbounded Variable'", label: "'Inter Tight Variable'", tempo: 'Continu · 800–1 100 ms', type: 'Unbounded + Inter Tight', palette: ['#FFFFFF', '#EEF8F9', '#0B2A2E', '#49B5BF'], bits: ['Carrousel circulaire des gammes', 'Hublots, chiffres en orbite', 'Transitions en iris, boutons magnétiques'] },
};

export function renderChooser({ out, directions, data }) {
  mkdirSync(join(out, 'chooser'), { recursive: true });
  const src = join(ROOT, 'assets/img/chooser');
  if (existsSync(src)) cpSync(src, join(out, 'chooser'), { recursive: true });
  cpSync(join(ROOT, 'assets/img/brand/logo-lockup-cyan.png'), join(out, 'chooser/logo.png'));
  const fonts = directions.map((d) => html`<link rel="stylesheet" href="${d.id}/assets/fonts.css">`);
  const page = html`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GRILLOO — Trois directions pour le site catalogue</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="chooser/logo.png">
${fonts}
<style>
  :root { --ink: #0f1214; --grey: #5b6568; --line: #e3e7e8; --paper: #f6f7f7; --cyan: #49b5bf; }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #fff; color: var(--ink); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
  a { color: inherit; text-decoration: none; }
  .wrap { max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 80px); }
  header { padding: 48px 0 72px; display: grid; gap: 28px; }
  header img { width: 150px; height: auto; }
  h1 { margin: 0; font-weight: 300; font-size: clamp(36px, 5vw, 72px); letter-spacing: -0.035em; line-height: 1; max-width: 18ch; }
  header p { margin: 0; color: var(--grey); font-size: 18px; max-width: 46em; line-height: 1.6; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; padding-bottom: 96px; }
  .card { display: grid; gap: 20px; align-content: start; }
  .shot { display: block; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 6px; box-shadow: 0 0 0 1px var(--line), 0 30px 60px -40px rgba(15, 18, 20, 0.35); }
  .shot img { width: 100%; height: 100%; object-fit: cover; object-position: left top; transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1); }
  .card:hover .shot img { transform: scale(1.04); }
  .n { font-size: 13px; letter-spacing: 0.12em; color: var(--grey); }
  .name { margin: 0; font-size: 44px; line-height: 1; letter-spacing: -0.03em; font-weight: 300; }
  .idea { margin: 0; color: var(--grey); line-height: 1.6; }
  .meta { display: grid; gap: 6px; font-size: 14px; color: var(--grey); padding-top: 14px; border-top: 1px solid var(--line); }
  .meta b { color: var(--ink); font-weight: 500; }
  .chips { display: flex; gap: 6px; }
  .chips i { width: 26px; height: 26px; border-radius: 50%; box-shadow: inset 0 0 0 1px var(--line); }
  ul { margin: 0; padding-left: 18px; color: var(--grey); font-size: 14.5px; line-height: 1.7; }
  .go { display: inline-flex; align-items: center; gap: 10px; justify-self: start; height: 48px; padding: 0 22px; border-radius: 999px; background: var(--ink); color: #fff; font-size: 15px; transition: background 400ms; }
  .go:hover { background: #1f7c86; }
  footer { padding: 32px 0 48px; border-top: 1px solid var(--line); color: var(--grey); font-size: 14px; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  @media (max-width: 1000px) { .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <img src="chooser/logo.png" alt="GRILLOO — Leader des solutions de nettoyage" width="150" height="74">
    <h1>Trois directions pour le site catalogue.</h1>
    <p>Même contenu (15 pages, ${data.products.length} fiches produit, guide de choix, demande de devis), même standard « White Premium ». Chaque direction varie la typographie, le rythme et le mouvement. Ouvrez-les et naviguez librement.</p>
  </header>
  <main class="grid">
    ${directions.map((d) => {
      const s = SPEC[d.id];
      return html`<article class="card">
        <a class="shot" href="${d.id}/index.html"><img src="chooser/${d.id}.jpg" alt="Accueil de la direction ${d.name}" loading="lazy"></a>
        <span class="n">DIRECTION ${s.n}</span>
        <h2 class="name" style="font-family:${raw(s.font)}">${d.name}</h2>
        <p class="idea">${d.idea}</p>
        <div class="meta"><span><b>Typographie</b> — <span style="font-family:${raw(s.label)}">${s.type}</span></span><span><b>Tempo</b> — ${s.tempo}</span></div>
        <div class="chips" aria-label="Palette">${s.palette.map((c) => html`<i style="background:${c}" title="${c}"></i>`)}</div>
        <ul>${s.bits.map((b) => html`<li>${b}</li>`)}</ul>
        <a class="go" href="${d.id}/index.html">Ouvrir ${d.name} →</a>
      </article>`;
    })}
  </main>
  <footer><span>GRILLOO — maquettes de travail, non indexées</span><span>Catalogue 2024</span></footer>
</div>
</body>
</html>`;
  writeFileSync(join(out, 'index.html'), String(page));
}
