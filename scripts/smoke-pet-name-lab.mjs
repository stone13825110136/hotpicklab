#!/usr/bin/env node
/**
 * Smoke test: every species × gender × vibe returns a usable shortlist,
 * tray split keeps names visible, and "more names" pages advance in score order (R2).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

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
  return Math.round(
    entry.popularity * 0.35 +
      lengthScore(entry.name) * 0.25 +
      callScore(entry.name) * 0.2 +
      vibeHit * 0.2,
  );
}
function rankNames(pool, gender, vibe) {
  const genderOk = (n) => {
    if (gender === 'neutral') return true;
    return n.gender.includes(gender) || n.gender.includes('neutral');
  };
  const matched = pool
    .filter(genderOk)
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
      return b.practical - a.practical || a.name.localeCompare(b.name);
    });
  const vibeFirst = matched.filter((n) => n.vibes.includes(vibe));
  const rest = matched.filter((n) => !n.vibes.includes(vibe));
  const ranked = [...vibeFirst, ...rest];
  if (ranked.length < 18) {
    const wider = pool
      .map((n) => ({
        ...n,
        practical: practicalScore(n, vibe),
        tags: [...new Set([...n.vibes, ...(n.popularity >= 88 ? ['popular'] : [])])],
      }))
      .sort((a, b) => b.practical - a.practical || a.name.localeCompare(b.name));
    const names = new Set(ranked.map((p) => p.name));
    for (const w of wider) {
      if (names.has(w.name)) continue;
      ranked.push(w);
      names.add(w.name);
    }
  }
  return ranked;
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

const BATCH = 18;
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
      const ranked = rankNames(pool, gender, vibe);
      const page0 = ranked.slice(0, BATCH);
      const page1 = ranked.slice(BATCH, BATCH * 2);
      const trays = splitTrays(page0);
      const visible = trays.top.length + trays.mid.length;
      const overlap = page1.filter((n) => page0.some((p) => p.name === n.name));
      const ok =
        ranked.length >= 12 &&
        page0.length >= 12 &&
        visible >= 6 &&
        overlap.length === 0 &&
        (page1.length === 0 || page0[0].practical >= page1[0].practical);

      if (!ok) {
        failed++;
        console.error('FAIL', {
          species,
          gender,
          vibe,
          total: ranked.length,
          page0: page0.length,
          page1: page1.length,
          visible,
          overlap: overlap.length,
        });
      } else {
        console.log(
          'OK',
          species,
          gender,
          vibe,
          `n=${ranked.length}`,
          `p0=${page0.length}`,
          `p1=${page1.length}`,
          `visible=${visible}`,
        );
      }
    }
  }
}

if (failed) {
  console.error(`\n${failed} combo(s) failed`);
  process.exit(1);
}
console.log('\nAll filter × tray × batch combos OK');
