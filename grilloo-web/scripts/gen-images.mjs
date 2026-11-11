// Generates the visual assets listed in scripts/prompts.json with the OpenAI Images API.
// Usage: node scripts/gen-images.mjs [--only id,id] [--model name] [--force] [--out dir] [--concurrency n]
// Key: env OPENAI_API_KEY (never written to disk).
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i === -1 ? def : args[i + 1]; };
const only = opt('only', '') ? opt('only').split(',') : null;
const force = args.includes('--force');
const outDir = opt('out', join(ROOT, 'assets/img/gen'));
const concurrency = Number(opt('concurrency', 4));
const MODELS = opt('model', '') ? [opt('model')] : ['gpt-image-2.5-flare', 'gpt-image-2'];
const key = process.env.OPENAI_API_KEY;
if (!key) { console.error('OPENAI_API_KEY missing'); process.exit(1); }

const { style, objectStyle, materialStyle, images } = JSON.parse(readFileSync(join(ROOT, 'scripts/prompts.json'), 'utf8'));
const todo = images.filter((im) => (!only || only.includes(im.id)) && (force || !existsSync(join(outDir, `${im.id}.webp`))));
mkdirSync(outDir, { recursive: true });

async function generate(im) {
  let lastErr;
  for (const model of MODELS) {
    const body = { model, prompt: `${im.prompt}\n\n${im.style === 'object' ? objectStyle : im.style === 'material' ? materialStyle : style}`, size: im.size, quality: 'high', n: 1 };
    if (im.background) body.background = im.background;
    if (im.background === 'transparent') body.output_format = 'png';
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) { lastErr = `${model}: ${json.error?.message || res.status}`; continue; }
    const buf = Buffer.from(json.data[0].b64_json, 'base64');
    const img = sharp(buf);
    await (im.background === 'transparent' ? img.webp({ quality: 88, alphaQuality: 90 }) : img.resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }))
      .toFile(join(outDir, `${im.id}.webp`));
    return model;
  }
  throw new Error(lastErr);
}

let ok = 0, failed = 0;
const queue = [...todo];
await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
  while (queue.length) {
    const im = queue.shift();
    try { const m = await generate(im); ok++; console.log(`ok   ${im.id} (${m})`); }
    catch (e) { failed++; console.log(`FAIL ${im.id}: ${e.message}`); }
  }
}));
console.log(`${ok} ok, ${failed} failed`);
