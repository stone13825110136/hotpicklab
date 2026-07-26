#!/usr/bin/env node
/**
 * Smoke test: every species × gender × vibe returns a usable shortlist
 * and tray split keeps names visible (R2).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

// Inline minimal copies of filter/split for Node without TS loader
const dogNames = JSON.parse(readFileSync(join(root, 'src/data/naming/dog-names.json'), 'utf8'));
const catNames = JSON.parse(readFileSync(join(root, 'src/data/naming/cat-names.json'), 'utf8'));

function lengthScore(name) {
  const n = name.length;
  if (n >= 3 && n <= 6) return 100;
  if (n === 2 || n === 7) return 85;
  if (n === 8) return 70;
  if (n < 2) return 40;
  return 55;
}
function callScore(name) {
  const vowels = (name.match(/[aeiouy]/gi) || []).length;
  const ratio = vowels / Math.max(name.length, 1);
  if (ratio >= 0.3 && ratio <= 0.55) return 95;
  if (ratio >= 0.2 && ratio < 0.3) return 75;
  return 55;
}
function practicalScore(entry, vibe) {
  const vibeHit = entry.vibes.includes(vibe) ? 100 : entry.vibes.length ? 60 : 50;
  return Math.round(entry.popularity * 0.35 + lengthScore(entry.name) * 0.25 + callScore(entry.name) * 0.2 + vibeHit * 0.2);
}
function filterNames(pool, gender, vibe, count = 18) {
  const matched = pool
    .filter((n) => n.gender.includes(gender) || (gender === 'neutral' && n.gender.includes('neutral')))
    .map((n) => {
      const practical = practicalScore(n, vibe);
      const tags = [...n.vibes];
      if (n.popularity >= 88) tags.push('popular');
      return { ...n, practical, tags: [...new Set(tags)] };
    })
    .sort((a, b) => {
      const aV = a.vibes.includes(vibe) ? 1 : 0;
      const bV = b.vibes.includes(vibe) ? 1 : 0;
      if (bV !== aV) return bV - aV;
      return b.practical - a.practical;
    });
  const vibeFirst = matched.filter((n) => n.vibes.includes(vibe));
  const rest = matched.filter((n) => !n.vibes.includes(vibe));
  const picked = [...vibeFirst, ...rest].slice(0, count);
  if (picked.length < 12) {
    const wider = pool
      .filter((n) => n.gender.includes(gender) || n.gender.includes('neutral'))
      .map((n) => ({
        ...n,
        practical: practicalScore(n, vibe),
        tags: [...new Set([...n.vibes, ...(n.popularity >= 88 ? ['popular'] : [])])],
      }))
      .sort((a, b) => b.practical - a.practical);
    const names = new Set(picked.map((p) => p.name));
    for (const w of wider) {
      if (names.has(w.name)) continue;
      picked.push(w);
      names.add(w.name);
      if (picked.length >= count) break;
    }
  }
  return picked.slice(0, count);
}
function splitTrays(list) {
  const sorted = [...list].sort((a, b) => b.practical - a.practical || a.name.localeCompare(b.name));
  if (!sorted.length) return { top: [], mid: [], low: [] };
  const topCount = Math.min(6, sorted.length);
  const midCount = Math.min(8, Math.max(0, sorted.length - topCount));
  return {
    top: sorted.slice(0, topCount),
    mid: sorted.slice(topCount, topCount + midCount),
    low: sorted.slice(topCount + midCount),
  };
}

const speciesList = [
  ['dog', dogNames],
  ['cat', catNames],
];
const genders = ['boy', 'girl', 'neutral'];
const vibes = ['cute', 'strong', 'unique', 'classic'];

let failed = 0;
for (const [species, pool] of speciesList) {
  for (const gender of genders) {
    for (const vibe of vibes) {
      const list = filterNames(pool, gender, vibe, 18);
      const trays = splitTrays(list);
      const visible = trays.top.length + trays.mid.length;
      const ok = list.length >= 12 && visible >= 6;
      if (!ok) {
        failed++;
        console.error('FAIL', { species, gender, vibe, total: list.length, visible, trays: { top: trays.top.length, mid: trays.mid.length, low: trays.low.length } });
      } else {
        console.log('OK', species, gender, vibe, `n=${list.length}`, `visible=${visible}`);
      }
    }
  }
}

if (failed) {
  console.error(`\n${failed} combo(s) failed`);
  process.exit(1);
}
console.log('\nAll filter × tray combos OK');
