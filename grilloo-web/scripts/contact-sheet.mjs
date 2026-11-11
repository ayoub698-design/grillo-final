// Builds review contact sheets of assets/img/gen: node scripts/contact-sheet.mjs <outDir>
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const gen = join(dirname(fileURLToPath(import.meta.url)), '../assets/img/gen');
const out = process.argv[2] || '.';
const groups = { amb: 4, tex: 2, obj: 3, mat: 3 };
for (const [prefix, cols] of Object.entries(groups)) {
  const files = readdirSync(gen).filter((f) => f.startsWith(prefix)).sort();
  const w = 440, h = prefix === 'obj' ? 440 : 293;
  const tiles = await Promise.all(files.map((f) => sharp(join(gen, f)).resize(w, h, { fit: 'cover', background: '#d9d9d9' }).flatten({ background: '#cfd8da' }).toBuffer()));
  const rows = Math.ceil(files.length / cols);
  await sharp({ create: { width: cols * (w + 8), height: rows * (h + 8), channels: 3, background: '#888' } })
    .composite(tiles.map((input, i) => ({ input, left: (i % cols) * (w + 8), top: Math.floor(i / cols) * (h + 8) })))
    .jpeg({ quality: 78 }).toFile(join(out, `sheet-${prefix}.jpg`));
  console.log(prefix, files.join(' '));
}
