#!/usr/bin/env node
/**
 * Build Naming Lab data from open sources (see docs/DATA-SOURCES.md).
 *
 * Sources:
 * - sindresorhus/dog-names (MIT) — male/female popular dog names
 * - sindresorhus/cat-names (MIT) — popular cat names
 * - NYC Dog Licensing Dataset (open data) — frequency → popularity / gender (best-effort)
 * - tarotoo-tarot (MIT) — 78 Rider–Waite–Smith card meanings (Tarotoo open dataset)
 *
 * Run: node scripts/build-naming-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { cards as tarotooCards } from 'tarotoo-tarot';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'data', 'naming');
const licenseDir = join(outDir, 'licenses');

mkdirSync(licenseDir, { recursive: true });

const dogMale = JSON.parse(
  readFileSync(join(root, 'node_modules/dog-names/male-dog-names.json'), 'utf8'),
);
const dogFemale = JSON.parse(
  readFileSync(join(root, 'node_modules/dog-names/female-dog-names.json'), 'utf8'),
);
const catAll = JSON.parse(
  readFileSync(join(root, 'node_modules/cat-names/cat-names.json'), 'utf8'),
);

/** @type {Map<string, { count: number, male: number, female: number }>} */
const nyc = new Map();

async function fetchNycFrequencies() {
  const url =
    'https://data.cityofnewyork.us/resource/nu7n-tubp.json?' +
    new URLSearchParams({
      $select: 'animalname,animalgender,count(*) as cnt',
      $group: 'animalname,animalgender',
      $where: "animalname is not null AND animalname not like '%UNKNOWN%' AND animalname not like '%NOT PROVIDED%'",
      $limit: '50000',
    });
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`NYC HTTP ${res.status}`);
    const rows = await res.json();
    for (const row of rows) {
      const raw = String(row.animalname || '').trim();
      if (!raw || raw.length > 24 || raw.length < 2) continue;
      if (/[^a-zA-Z\s'\-]/.test(raw)) continue;
      const name = raw
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const g = String(row.animalgender || '').toUpperCase();
      const cnt = Number(row.cnt) || 0;
      const cur = nyc.get(name) || { count: 0, male: 0, female: 0 };
      cur.count += cnt;
      if (g === 'M') cur.male += cnt;
      if (g === 'F') cur.female += cnt;
      nyc.set(name, cur);
    }
    console.log('NYC rows aggregated:', nyc.size, 'distinct names');
  } catch (err) {
    console.warn('NYC fetch skipped:', err.message);
  }
}

function vibeGuess(name, popularity) {
  const vibes = new Set();
  const lower = name.toLowerCase();
  if (popularity >= 75) vibes.add('classic');
  if (popularity <= 45) vibes.add('unique');
  if (/[yie]$/i.test(name) || /(ie|ey|y)$/i.test(lower)) vibes.add('cute');
  if (name.length <= 4) vibes.add('strong');
  if (/(max|rex|thor|zeus|duke|bear|tiger|blaze|rocky)/i.test(lower)) vibes.add('strong');
  if (vibes.size === 0) vibes.add(popularity >= 60 ? 'classic' : 'unique');
  return [...vibes];
}

function popularityFromListIndex(index, total) {
  return Math.max(20, Math.round(100 - (index / Math.max(total - 1, 1)) * 80));
}

function popularityFromNyc(name, fallback) {
  const hit = nyc.get(name);
  if (!hit) return fallback;
  // Soft log scale against max count in map
  let max = 1;
  for (const v of nyc.values()) max = Math.max(max, v.count);
  const score = 20 + Math.round((Math.log1p(hit.count) / Math.log1p(max)) * 80);
  return Math.min(99, score);
}

function buildDogEntries() {
  const byName = new Map();
  dogMale.forEach((name, i) => {
    const popList = popularityFromListIndex(i, dogMale.length);
    byName.set(name, {
      name,
      gender: ['boy'],
      vibes: vibeGuess(name, popList),
      popularity: popularityFromNyc(name, popList),
      sources: ['dog-names'],
    });
  });
  dogFemale.forEach((name, i) => {
    const popList = popularityFromListIndex(i, dogFemale.length);
    const existing = byName.get(name);
    if (existing) {
      if (!existing.gender.includes('girl')) existing.gender.push('girl');
      if (!existing.gender.includes('neutral') && existing.gender.includes('boy') && existing.gender.includes('girl')) {
        existing.gender.push('neutral');
      }
      existing.popularity = Math.max(existing.popularity, popularityFromNyc(name, popList));
      existing.vibes = [...new Set([...existing.vibes, ...vibeGuess(name, existing.popularity)])];
    } else {
      byName.set(name, {
        name,
        gender: ['girl'],
        vibes: vibeGuess(name, popList),
        popularity: popularityFromNyc(name, popList),
        sources: ['dog-names'],
      });
    }
  });

  // Enrich gender from NYC when name only on one list
  for (const [name, entry] of byName) {
    const hit = nyc.get(name);
    if (!hit) continue;
    entry.sources = [...new Set([...(entry.sources || []), 'nyc-dog-licensing'])];
    if (hit.male > 0 && !entry.gender.includes('boy')) entry.gender.push('boy');
    if (hit.female > 0 && !entry.gender.includes('girl')) entry.gender.push('girl');
    if (entry.gender.includes('boy') && entry.gender.includes('girl') && !entry.gender.includes('neutral')) {
      entry.gender.push('neutral');
    }
  }

  return [...byName.values()].sort((a, b) => b.popularity - a.popularity);
}

function buildCatEntries() {
  // Cat package is a flat popular list (no gender split) — mark neutral + soft cues
  return catAll.map((name, i) => {
    const popList = popularityFromListIndex(i, catAll.length);
    const gender = ['neutral'];
    // Soft gender hints from shared human-name conventions (still open heuristic)
    if (/^(bella|lucy|luna|lily|daisy|molly|lola|chloe|willow|cleo|nala|princess)$/i.test(name)) {
      gender.length = 0;
      gender.push('girl', 'neutral');
    } else if (/^(oliver|simba|leo|max|felix|jasper|tiger|oscar|jack|theo)$/i.test(name)) {
      gender.length = 0;
      gender.push('boy', 'neutral');
    }
    return {
      name,
      gender,
      vibes: vibeGuess(name, popList),
      popularity: popList,
      sources: ['cat-names'],
    };
  });
}

function buildTarot() {
  return tarotooCards.map((c) => ({
    id: c.id,
    name: c.name,
    arcana: c.arcana,
    vibe: namingVibeFromCard(c),
    keywords: (c.keywords_upright || []).slice(0, 4),
    source: 'tarotoo-tarot',
  }));
}

function namingVibeFromCard(c) {
  const mood = (c.mood || '').replace(/\.$/, '');
  const meaning = (c.meaning_upright || '').split('.')[0];
  const bits = [mood, meaning].filter(Boolean);
  return bits.join(' — ') || (c.keywords_upright || []).slice(0, 3).join(', ');
}

function writeAttribution() {
  const text = `# Naming Lab data attribution

Built by \`npm run build-naming-data\` from open sources listed in \`docs/DATA-SOURCES.md\`.

## Pet names

| Package / dataset | License | Role |
|-------------------|---------|------|
| [sindresorhus/dog-names](https://github.com/sindresorhus/dog-names) (\`dog-names\` npm) | MIT | Dog name seed (male/female lists) |
| [sindresorhus/cat-names](https://github.com/sindresorhus/cat-names) (\`cat-names\` npm) | MIT | Cat name seed |
| [NYC Dog Licensing Dataset](https://data.cityofnewyork.us/Health/NYC-Dog-Licensing-Dataset/nu7n-tubp) | NYC Open Data | Frequency / gender enrichment when fetch succeeds |

License files copied under \`licenses/\`.

## Fortune Draw

| Package / dataset | License | Role |
|-------------------|---------|------|
| [tarotoo-tarot](https://www.npmjs.com/package/tarotoo-tarot) / [Tarotoo tarot dataset](https://github.com/Tarotoo-com/tarotoo-tarot-dataset) | MIT | 78 Rider–Waite–Smith meanings |

Card text adapted into short “naming vibe” lines for entertainment only — Fun reading · Not a prediction.

Dataset homepage: https://tarotoo.com/open-data
`;
  writeFileSync(join(outDir, 'ATTRIBUTION.md'), text);
}

function copyLicenses() {
  const pairs = [
    ['node_modules/dog-names/license', 'dog-names.MIT.txt'],
    ['node_modules/cat-names/license', 'cat-names.MIT.txt'],
    ['node_modules/tarotoo-tarot/README.md', 'tarotoo-tarot.README.md'],
  ];
  for (const [src, dest] of pairs) {
    const from = join(root, src);
    if (existsSync(from)) copyFileSync(from, join(licenseDir, dest));
  }
}

await fetchNycFrequencies();
const dogs = buildDogEntries();
const cats = buildCatEntries();
const tarot = buildTarot();

writeFileSync(join(outDir, 'dog-names.json'), JSON.stringify(dogs, null, 2) + '\n');
writeFileSync(join(outDir, 'cat-names.json'), JSON.stringify(cats, null, 2) + '\n');
writeFileSync(join(outDir, 'tarot-meanings.json'), JSON.stringify(tarot, null, 2) + '\n');
writeAttribution();
copyLicenses();

console.log('Wrote', dogs.length, 'dog names,', cats.length, 'cat names,', tarot.length, 'tarot cards');
console.log('Output:', outDir);
