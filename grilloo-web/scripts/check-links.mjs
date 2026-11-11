// Lists every relative href/src/srcset/url() in dist that points to a missing file.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const SKIP = /^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/;

function refsOf(file, text) {
  const refs = [];
  if (file.endsWith('.html')) {
    const noScripts = text.replace(/<script(?![^>]*\bsrc=)[\s\S]*?<\/script>/g, '');
    for (const m of noScripts.matchAll(/\s(?:href|src)="([^"]*)"/g)) refs.push(m[1]);
    for (const m of noScripts.matchAll(/\ssrcset="([^"]*)"/g)) m[1].split(',').forEach((s) => refs.push(s.trim().split(/\s+/)[0]));
    for (const m of noScripts.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) refs.push(m[2]);
  } else if (file.endsWith('.css')) {
    for (const m of text.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) refs.push(m[2]);
  }
  return refs.filter((r) => r && !SKIP.test(r));
}

export function checkLinks(dir) {
  const broken = [];
  for (const file of walk(dir).filter((f) => /\.(html|css)$/.test(f))) {
    for (const ref of refsOf(file, readFileSync(file, 'utf8'))) {
      const clean = decodeURI(ref.split(/[?#]/)[0]);
      if (!clean) continue;
      if (clean.startsWith('/')) { broken.push(`${file} → ${ref} (absolute)`); continue; }
      if (!existsSync(resolve(dirname(file), clean))) broken.push(`${file} → ${ref}`);
    }
  }
  return broken;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2] || 'dist';
  const broken = checkLinks(dir);
  broken.slice(0, 50).forEach((b) => console.log(b));
  console.log(`${broken.length} broken`);
  process.exit(broken.length ? 1 : 0);
}
