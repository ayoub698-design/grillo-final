// Converts the catalogue cutouts (assets/img/cut/*.png) to trimmed WebP and removes the PNGs.
// Originals stay in ../grilloo-catalogue/public/img/cut.
import { readdirSync, unlinkSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../assets/img/cut');
let before = 0, after = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.png'))) {
  const src = join(dir, f), out = join(dir, f.replace(/\.png$/, '.webp'));
  before += statSync(src).size;
  await sharp(src).trim({ threshold: 4 }).webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(out);
  after += statSync(out).size;
  unlinkSync(src);
}
console.log(`cut: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`);
