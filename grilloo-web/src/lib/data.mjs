import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../data');
const read = (name) => JSON.parse(readFileSync(join(DATA_DIR, `${name}.json`), 'utf8'));

let cache = null;
export function loadData() {
  if (!cache) {
    cache = {
      brand: read('brand'),
      products: read('catalog'),
      gammes: read('gammes'),
      sectors: read('sectors'),
      site: read('site'),
      pages: read('pages'),
    };
  }
  return cache;
}

export const productsOf = (data, gammeSlug) => data.products.filter((p) => p.gamme === gammeSlug);
export const productBySlug = (data, slug) => data.products.find((p) => p.slug === slug);

export function rangeOf(products, keyName) {
  const values = products.map((p) => p.key?.[keyName]).filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (!values.length) return null;
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function related(data, product, n = 4) {
  const ref = product.key?.productivity ?? 0;
  return productsOf(data, product.gamme)
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Math.abs((a.key?.productivity ?? 1e9) - ref) - Math.abs((b.key?.productivity ?? 1e9) - ref))
    .slice(0, n);
}
