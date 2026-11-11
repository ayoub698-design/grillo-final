// Splits a tall screenshot into N jpg parts for review: node scripts/split-shot.mjs <png> <parts> [width]
import sharp from 'sharp';
const [f, n = '4', w = '1000'] = process.argv.slice(2);
const m = await sharp(f).metadata();
const ph = Math.ceil(m.height / Number(n));
for (let i = 0; i < Number(n); i++) {
  const top = i * ph; const height = Math.min(ph, m.height - top);
  if (height <= 0) break;
  await sharp(f).extract({ left: 0, top, width: m.width, height }).resize(Number(w)).jpeg({ quality: 80 }).toFile(f.replace(/\.png$/, `-${i}.jpg`));
}
console.log(m.width, m.height);
