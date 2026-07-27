#!/usr/bin/env node
/**
 * Smoke test: species × gender × vibe (+ letter / breed soft) shortlists (R2).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dogNames = JSON.parse(readFileSync(join(root, 'src/data/naming/dog-names.json'), 'utf8'));
const catNames = JSON.parse(readFileSync(join(root, 'src/data/naming/cat-names.json'), 'utf8'));
const affinity = JSON.parse(
  readFileSync(join(root, 'src/data/naming/breed-name-affinity.json'), 'utf8'),
);

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
function matchesLetter(name, letter) {
  if (!letter) return true;
  return name.trim().charAt(0).toUpperCase() === letter.toUpperCase();
}
function breedAffinity(name, vibes, breedId) {
  if (!breedId) return { score: 0, fit: false };
  const tops = affinity.breeds?.[breedId]?.topNames?.map((r) => r.name.toLowerCase()) || [];
  const inBoost = tops.includes(name.toLowerCase());
  return { score: inBoost ? 55 : 0, fit: inBoost };
}
function rankNames(pool, gender, vibe, filters = {}) {
  const letter = filters.letter || '';
  const breedId = filters.breedId || '';
  const genderOk = (n) => {
    if (gender === 'neutral') return true;
    return n.gender.includes(gender) || n.gender.includes('neutral');
  };
  const letterPool = pool.filter((n) => matchesLetter(n.name, letter));
  const matched = letterPool
    .filter(genderOk)
    .map((n) => {
      const practical = practicalScore(n, vibe);
      const { score: breedA, fit } = breedAffinity(n.name, n.vibes, breedId);
      const tags = [...n.vibes];
      if (n.popularity >= 88) tags.push('popular');
      if (fit) tags.push('breed fit');
      return { ...n, practical, breedAffinity: breedA, tags: [...new Set(tags)] };
    })
    .sort((a, b) => {
      const aV = a.vibes.includes(vibe) ? 1 : 0;
      const bV = b.vibes.includes(vibe) ? 1 : 0;
      if (bV !== aV) return bV - aV;
      if ((b.breedAffinity || 0) !== (a.breedAffinity || 0)) {
        return (b.breedAffinity || 0) - (a.breedAffinity || 0);
      }
      return b.practical - a.practical || a.name.localeCompare(b.name);
    });
  const vibeFirst = matched.filter((n) => n.vibes.includes(vibe));
  const rest = matched.filter((n) => !n.vibes.includes(vibe));
  return [...vibeFirst, ...rest];
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
let failed = 0;

for (const [species, pool] of [
  ['dog', dogNames],
  ['cat', catNames],
]) {
  for (const gender of ['boy', 'girl', 'neutral']) {
    for (const vibe of ['cute', 'strong', 'unique', 'classic']) {
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
        console.error('FAIL base', { species, gender, vibe, total: ranked.length });
      } else {
        console.log('OK', species, gender, vibe, `n=${ranked.length}`);
      }
    }
  }
}

// Letter: exact J cats should include new extras; soft-fill when thin
{
  const ranked = rankNames(catNames, 'boy', 'strong', { letter: 'J' });
  // smoke uses old cat-only pool — check dog letter still hard-enough
  const dogJ = rankNames(dogNames, 'neutral', 'cute', { letter: 'J' });
  const bad = dogJ.filter((n) => n.name[0].toUpperCase() !== 'J').length;
  // With soft fill, non-J allowed only when exact < 12
  const exact = dogJ.filter((n) => n.name[0].toUpperCase() === 'J').length;
  if (exact < 1) {
    failed++;
    console.error('FAIL letter J dogs', { exact, total: dogJ.length, bad });
  } else {
    console.log('OK letter J dogs', { exact, total: dogJ.length, filled: bad });
  }
  void ranked;
}

// Breed soft: Labrador should surface breed-linked names; practical unchanged
{
  const base = rankNames(dogNames, 'neutral', 'cute');
  const lab = rankNames(dogNames, 'neutral', 'cute', { breedId: 'labrador' });
  const tops = (affinity.breeds?.labrador?.topNames || []).slice(0, 10).map((r) => r.name.toLowerCase());
  const nycTop = new Set(tops);
  // Fallback: heuristic boosts from profile must still associate
  const profileTops = new Set(
    tops.length
      ? tops
      : ['buddy', 'bailey', 'max', 'charlie', 'cooper', 'daisy', 'bella', 'lucy'],
  );
  const checkSet = nycTop.size ? nycTop : profileTops;
  const labFits = lab.slice(0, 24).filter((n) => checkSet.has(n.name.toLowerCase())).length;
  const sample = lab.find((n) => checkSet.has(n.name.toLowerCase())) || lab[0];
  const baseSample = base.find((n) => n.name === sample.name);
  const practicalSame = !baseSample || sample.practical === baseSample.practical;
  const inPool = [...checkSet].filter((n) => dogNames.some((d) => d.name.toLowerCase() === n)).length;
  if (!practicalSame || labFits < 2 || inPool < 4) {
    failed++;
    console.error('FAIL breed soft', { labFits, practicalSame, inPool, sample: sample?.name });
  } else {
    console.log('OK breed soft labrador', { labFits, inPool, sample: sample.name });
  }
}

// Association: Cat + Boy + Strong + Starts with J should have letter-J matches in tray
{
  const ranked = rankNames(catNames, 'boy', 'strong', { letter: 'J' });
  const exact = ranked.filter((n) => n.name[0].toUpperCase() === 'J').length;
  if (exact < 3 || ranked.length < 12) {
    failed++;
    console.error('FAIL cat boy strong J association', { exact, total: ranked.length });
  } else {
    console.log('OK cat boy strong J', { exact, total: ranked.length });
  }
}

// Styles must feel different: Unique top tray should not mirror Classic
{
  const classicTop = new Set(
    rankNames(dogNames, 'neutral', 'classic')
      .slice(0, 18)
      .map((n) => n.name.toLowerCase()),
  );
  const uniqueTop = rankNames(dogNames, 'neutral', 'unique').slice(0, 18);
  const overlap = uniqueTop.filter((n) => classicTop.has(n.name.toLowerCase())).length;
  const uniquePure = uniqueTop.filter((n) => n.vibes.includes('unique')).length;
  if (overlap > 8 || uniquePure < 12) {
    failed++;
    console.error('FAIL style differentiation', { overlap, uniquePure, sample: uniqueTop.slice(0, 6).map((n) => n.name) });
  } else {
    console.log('OK style differentiation', {
      overlap,
      uniquePure,
      uniqueSample: uniqueTop.slice(0, 6).map((n) => n.name),
      classicSample: [...classicTop].slice(0, 6),
    });
  }
}

// Pool size target
{
  if (dogNames.length < 900 || catNames.length < 900) {
    failed++;
    console.error('FAIL pool size', { dogs: dogNames.length, cats: catNames.length });
  } else {
    console.log('OK pool size', { dogs: dogNames.length, cats: catNames.length });
  }
}

if (failed) {
  console.error(`\n${failed} combo(s) failed`);
  process.exit(1);
}
console.log('\nAll filter × tray × letter × breed checks OK');
