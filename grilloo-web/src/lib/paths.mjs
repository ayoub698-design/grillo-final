import { posix } from 'node:path';
// Relative URL from the page `fromFile` to `toFile` (both relative to the site root).
export function rel(fromFile, toFile) {
  const r = posix.relative(posix.dirname(fromFile), toFile);
  return r || posix.basename(toFile);
}
