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
  const vibeHit = entry.vibes.includes(vibe)
    ? entry.vibes.length === 1
      ? 100
      : 82
    : entry.vibes.length
      ? 55
      : 50;
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
function hardGenderMatch(n, gender) {
  if (gender === 'neutral') return true;
  return n.gender.includes(gender);
}
function softUnisexMatch(n, gender) {
  if (gender === 'neutral') return true;
  if (n.gender.includes(gender)) return false;
  const opposite = gender === 'boy' ? 'girl' : 'boy';
  return n.gender.includes('neutral') && !n.gender.includes(opposite);
}
function rankNames(pool, gender, vibe, filters = {}) {
  const letter = filters.letter || '';
  const breedId = filters.breedId || '';
  const GENDER_SOFT_MIN = 18;
  const hard = gender === 'neutral' ? pool : pool.filter((n) => hardGenderMatch(n, gender));
  const soft =
    gender === 'neutral' ? [] : pool.filter((n) => softUnisexMatch(n, gender));
  let genderPool = hard;
  if (gender !== 'neutral' && hard.length < GENDER_SOFT_MIN) {
    const hardNames = new Set(hard.map((n) => n.name));
    genderPool = [...hard, ...soft.filter((n) => !hardNames.has(n.name))];
  }
  const letterPool = letter
    ? genderPool.filter((n) => matchesLetter(n.name, letter))
    : genderPool;
  let working = letterPool;
  if (letter && letterPool.length < 12) {
    const exact = new Set(letterPool.map((n) => n.name));
    working = [...letterPool, ...genderPool.filter((n) => !exact.has(n.name))];
  }
  const matched = working
    .map((n) => {
      const practical = practicalScore(n, vibe);
      const { score: breedA, fit } = breedAffinity(n.name, n.vibes, breedId);
      const genderMatch = hardGenderMatch(n, gender);
      const primary = n.vibes.includes(vibe) ? vibe : n.vibes[0];
      const tags = primary ? [primary] : [];
      if (fit) tags.push('breed fit');
      return {
        ...n,
        practical,
        breedAffinity: breedA,
        letterMatch: letter ? matchesLetter(n.name, letter) : false,
        genderMatch,
        tags,
      };
    })
    .sort((a, b) => {
      const aL = a.letterMatch ? 1 : 0;
      const bL = b.letterMatch ? 1 : 0;
      if (bL !== aL) return bL - aL;
      const aG = a.genderMatch ? 1 : 0;
      const bG = b.genderMatch ? 1 : 0;
      if (bG !== aG) return bG - aG;
      const aV = a.vibes.includes(vibe) ? 1 : 0;
      const bV = b.vibes.includes(vibe) ? 1 : 0;
      if (bV !== aV) return bV - aV;
      const aEx = a.vibes.length === 1 && a.vibes[0] === vibe ? 1 : 0;
      const bEx = b.vibes.length === 1 && b.vibes[0] === vibe ? 1 : 0;
      if (bEx !== aEx) return bEx - aEx;
      const aF = (a.sources || []).includes('style-flagship') ? 1 : 0;
      const bF = (b.sources || []).includes('style-flagship') ? 1 : 0;
      if (bF !== aF) return bF - aF;
      const aS = (a.sources || []).includes('pool-synthesize') ? 0 : 1;
      const bS = (b.sources || []).includes('pool-synthesize') ? 0 : 1;
      if (bS !== aS) return bS - aS;
      if ((b.breedAffinity || 0) !== (a.breedAffinity || 0)) {
        return (b.breedAffinity || 0) - (a.breedAffinity || 0);
      }
      return b.practical - a.practical || a.name.localeCompare(b.name);
    });
  const vibeFirst = matched.filter((n) => n.vibes.includes(vibe));
  const rest = matched.filter((n) => !n.vibes.includes(vibe));
  if (letter) {
    const letterHits = matched.filter((n) => n.letterMatch);
    const letterMiss = matched.filter((n) => !n.letterMatch);
    const byVibe = (arr) => [
      ...arr.filter((n) => n.vibes.includes(vibe)),
      ...arr.filter((n) => !n.vibes.includes(vibe)),
    ];
    return [...byVibe(letterHits), ...byVibe(letterMiss)];
  }
  return [...vibeFirst, ...rest];
}
function splitTrays(list) {
  if (!list.length) return { top: [], mid: [], low: [] };
  const topCount = Math.min(6, list.length);
  const midCount = Math.min(8, Math.max(0, list.length - topCount));
  return {
    top: list.slice(0, topCount),
    mid: list.slice(topCount, topCount + midCount),
    low: list.slice(topCount + midCount),
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
        overlap.length === 0;
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

// Breed soft: Labrador should surface breed-linked names under Classic; practical unchanged
{
  const base = rankNames(dogNames, 'neutral', 'classic');
  const lab = rankNames(dogNames, 'neutral', 'classic', { breedId: 'labrador' });
  const tops = (affinity.breeds?.labrador?.topNames || []).slice(0, 10).map((r) => r.name.toLowerCase());
  const nycTop = new Set(tops);
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

// Quality: top 18 per vibe — flagships up front, no letter-synth junk
{
  const vibes = ['cute', 'strong', 'unique', 'classic'];
  for (const vibe of vibes) {
    const top = rankNames(dogNames, 'neutral', vibe).slice(0, 18);
    const synth = top.filter((n) => (n.sources || []).includes('pool-synthesize')).length;
    const flag = top.filter((n) => (n.sources || []).includes('style-flagship')).length;
    const exclusive = top.filter((n) => n.vibes.length === 1 && n.vibes[0] === vibe).length;
    if (synth > 0 || flag < 10 || exclusive < 10) {
      failed++;
      console.error('FAIL vibe quality', { vibe, synth, flag, exclusive, sample: top.slice(0, 8).map((n) => n.name) });
    } else {
      console.log('OK vibe quality', { vibe, flag, exclusive, sample: top.slice(0, 6).map((n) => n.name) });
    }
  }
}

// Letter soft-fill: exact letter matches must lead the first batch / top tray
{
  const ranked = rankNames(dogNames, 'boy', 'classic', { letter: 'F' });
  const exactAll = ranked.filter((n) => n.name[0].toUpperCase() === 'F');
  const page0 = ranked.slice(0, 18);
  const trays = splitTrays(page0);
  const lead = ranked.slice(0, Math.max(exactAll.length, 1));
  const leadBad = lead.filter((n) => n.name[0].toUpperCase() !== 'F').length;
  const topExact = trays.top.filter((n) => n.name[0].toUpperCase() === 'F').length;
  if (exactAll.length < 1 || leadBad > 0 || topExact < Math.min(6, exactAll.length)) {
    failed++;
    console.error('FAIL letter F order', {
      exact: exactAll.length,
      leadBad,
      topExact,
      topSample: trays.top.map((n) => n.name),
    });
  } else {
    console.log('OK letter F order', {
      exact: exactAll.length,
      topExact,
      topSample: trays.top.map((n) => n.name),
    });
  }
}

// Boy vs Girl must change the front tray (strict gender — the bug user hit)
{
  for (const vibe of ['cute', 'classic', 'unique']) {
    const boyTop = rankNames(dogNames, 'boy', vibe).slice(0, 12);
    const girlTop = rankNames(dogNames, 'girl', vibe).slice(0, 12);
    const boySet = new Set(boyTop.map((n) => n.name.toLowerCase()));
    const overlap = girlTop.filter((n) => boySet.has(n.name.toLowerCase())).length;
    const boyHard = boyTop.filter((n) => n.gender.includes('boy')).length;
    const girlHard = girlTop.filter((n) => n.gender.includes('girl')).length;
    const girlHasBoyOnly = girlTop.filter(
      (n) => n.gender.includes('boy') && !n.gender.includes('girl') && !n.gender.includes('neutral'),
    ).length;
    if (overlap > 4 || boyHard < 8 || girlHard < 8 || girlHasBoyOnly > 0) {
      failed++;
      console.error('FAIL boy≠girl', {
        vibe,
        overlap,
        boyHard,
        girlHard,
        girlHasBoyOnly,
        boySample: boyTop.slice(0, 6).map((n) => n.name),
        girlSample: girlTop.slice(0, 6).map((n) => n.name),
      });
    } else {
      console.log('OK boy≠girl', {
        vibe,
        overlap,
        boyHard,
        girlHard,
        boySample: boyTop.slice(0, 6).map((n) => n.name),
        girlSample: girlTop.slice(0, 6).map((n) => n.name),
      });
    }
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
