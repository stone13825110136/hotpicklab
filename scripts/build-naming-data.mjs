#!/usr/bin/env node
/**
 * Build Naming Lab data from open sources (see docs/DATA-SOURCES.md).
 *
 * Goals (customer filters must associate logically):
 * - ~1000 dog names, ~1000 cat names
 * - Every letter A–Z has enough names
 * - boy / girl / vibes well covered
 * - Breed affinity tops only keep names that exist in the dog pool
 *
 * Run: npm run build-naming-data
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { cards as tarotooCards } from 'tarotoo-tarot';
import { HEURISTIC_BREED_TOPS, POOL_SUPPLEMENT } from './naming-pool-supplement.mjs';
import { STYLE_BANKS } from './style-name-banks.mjs';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'data', 'naming');
const licenseDir = join(outDir, 'licenses');

mkdirSync(licenseDir, { recursive: true });

const TARGET = 1000;
const MIN_PER_LETTER = 22;
/** NYC Open Data often hangs/403 from some networks — never wait forever. */
const NYC_TIMEOUT_MS = Number(process.env.NYC_TIMEOUT_MS || 8000);
const SKIP_NYC = process.env.SKIP_NYC === '1' || process.env.SKIP_NYC === 'true';

async function fetchWithTimeout(url, ms = NYC_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

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

const JUNK = /^(unknown|name not provided|name|none|na|n\/a|null|test|dog|cat|puppy|kitten)$/i;

function titleCaseName(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanName(raw) {
  const name = titleCaseName(raw);
  if (!name || name.length < 2 || name.length > 12) return '';
  if (JUNK.test(name)) return '';
  if (/[^a-zA-Z\s'\-]/.test(name)) return '';
  if (/\s/.test(name) && name.split(/\s+/).length > 2) return '';
  return name;
}

/**
 * Assign at most 2 vibes; prefer ONE clear primary so filters feel different.
 * Style-bank overrides win later via applyStyleBanks().
 */
function vibeGuess(name, popularity, sourceHint = '') {
  const lower = name.toLowerCase();
  const hits = [];

  const strongHit =
    name.length <= 4 ||
    /^(max|rex|thor|zeus|duke|bear|tiger|blaze|rocky|axe|knox|jett|wolf|storm|tank|spike|bolt|fang|titan|diesel|gunner|hawk|king|ace|jax|rock)$/i.test(
      lower,
    ) ||
    /(blaze|storm|thunder|shadow|ghost|steel|iron|blade)/i.test(lower);
  const cuteHit =
    /(ie|ey|y)$/i.test(lower) ||
    /^(mochi|biscuit|pumpkin|cupcake|waffles|pickles|noodle|bean|pip|cookie|muffin|honey|sugar|bubbles|coco|kiwi|peanut|teddy|lulu|kiki|gigi|ore|oreo|nugget|loaf)$/i.test(
      lower,
    ) ||
    /(luna|bella|daisy|willow|maple|pepper|olive|poppy|peach)/i.test(lower);
  const uniqueHit =
    popularity <= 48 ||
    sourceHint.includes('synthesize') ||
    /^(ziggy|jinx|nova|pixel|echo|cosmo|onyx|quill|nyx|vesper|rune|neon|glyph|quark|umbra|zenith|prism|orbit|hex|vex|wisp|lumen)$/i.test(
      lower,
    ) ||
    /(pixel|cipher|glyph|quark|neon|glitch|zenith|solstice|vortex)/i.test(lower);
  const classicHit =
    popularity >= 72 ||
    /^(charlie|bailey|cooper|buddy|lucy|molly|oliver|jack|toby|maggie|sophie|chloe|milo|leo|oscar|felix|ruby|stella|sadie|lola|penny|george|henry|arthur|winston|grace|alice|sam|alex)$/i.test(
      lower,
    );

  // Score candidates; pick best primary, optional secondary if clearly dual
  const scores = {
    strong: strongHit ? 3 : 0,
    cute: cuteHit ? 3 : 0,
    unique: uniqueHit ? 3 : 0,
    classic: classicHit ? 3 : 0,
  };
  if (popularity >= 70 && !classicHit) scores.classic += 1;
  if (popularity <= 45 && !uniqueHit) scores.unique += 1;
  if (name.length <= 4 && !strongHit) scores.strong += 1;
  if (/(ie|y)$/i.test(lower) && !cuteHit) scores.cute += 1;

  const ranked = Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  if (!ranked.length) {
    return [popularity >= 60 ? 'classic' : 'unique'];
  }

  hits.push(ranked[0][0]);
  // Only add second vibe when nearly as strong AND not flooding classic+cute on everything
  if (ranked[1] && ranked[1][1] >= 3 && ranked[1][1] >= ranked[0][1] - 0) {
    const pair = [ranked[0][0], ranked[1][0]].sort().join('+');
    // Allow strong+unique, cute+unique, classic+cute — block classic+unique unless both strong
    if (pair !== 'classic+unique' || (classicHit && uniqueHit && ranked[1][1] >= 3)) {
      hits.push(ranked[1][0]);
    }
  }

  return [...new Set(hits)].slice(0, 2);
}

/** Force style-bank vibes onto matching names; insert missing bank names. */
function applyStyleBanks(entries, species) {
  const byName = new Map(entries.map((e) => [e.name.toLowerCase(), e]));
  let updated = 0;
  let inserted = 0;

  for (const row of STYLE_BANKS) {
    const name = cleanName(row.name);
    if (!name) continue;
    const key = name.toLowerCase();
    const vibes = [...new Set((row.vibes || []).slice(0, 2))];
    if (!vibes.length) continue;
    const gender = row.gender || genderHeuristic(name, ['neutral']);
    const existing = byName.get(key);
    if (existing) {
      existing.vibes = vibes;
      existing.gender = [...new Set([...(existing.gender || []), ...gender])];
      existing.sources = [...new Set([...(existing.sources || []), 'style-bank'])];
      // Slight popularity nudge so styled names surface in their vibe tray
      if (vibes.includes('unique')) existing.popularity = Math.min(existing.popularity, 55);
      if (vibes.includes('classic') && !vibes.includes('unique')) {
        existing.popularity = Math.max(existing.popularity, 70);
      }
      updated++;
    } else if (byName.size < TARGET + 120) {
      const popularity = vibes.includes('classic') ? 78 : vibes.includes('unique') ? 42 : 58;
      const entry = {
        name,
        gender,
        vibes,
        popularity,
        sources: ['style-bank'],
      };
      byName.set(key, entry);
      inserted++;
    }
  }

  console.log(`${species}: style-bank updated`, updated, 'inserted', inserted);
  return [...byName.values()];
}

/** Drop muddy triple tags; keep primary (+ optional second). */
function sharpenVibes(entries) {
  for (const e of entries) {
    if (!e.vibes?.length) {
      e.vibes = vibeGuess(e.name, e.popularity, (e.sources || []).join(','));
      continue;
    }
    if (e.vibes.length > 2) {
      e.vibes = e.vibes.slice(0, 2);
    }
    // Synthesized letter fillers should read as unique, not classic
    if ((e.sources || []).includes('pool-synthesize') && !e.vibes.includes('unique')) {
      e.vibes = ['unique'];
    }
  }
  return entries;
}

function popularityFromListIndex(index, total) {
  return Math.max(20, Math.round(100 - (index / Math.max(total - 1, 1)) * 80));
}

function popularityFromNyc(name, fallback) {
  const hit = nyc.get(name);
  if (!hit) return fallback;
  let max = 1;
  for (const v of nyc.values()) max = Math.max(max, v.count);
  const score = 20 + Math.round((Math.log1p(hit.count) / Math.log1p(max)) * 80);
  return Math.min(99, score);
}

function genderFromNyc(hit, fallback) {
  if (!hit) return fallback;
  const genders = new Set(fallback);
  if (hit.male > 0) genders.add('boy');
  if (hit.female > 0) genders.add('girl');
  if (genders.has('boy') && genders.has('girl')) genders.add('neutral');
  if (!genders.size) genders.add('neutral');
  return [...genders];
}

function genderHeuristic(name, fallback = ['neutral']) {
  const lower = name.toLowerCase();
  if (
    /^(bella|lucy|luna|lily|daisy|molly|lola|chloe|willow|cleo|nala|princess|sadie|ruby|stella|sophie|mia|emma|olivia|aria|nova|ivy|hazel|violet|juno|zelda|freya|gina|gigi|honey|holly|iris|isla|jade|june|katie|kira|lady|layla|lexi|lulu|mabel|maggie|maya|millie|misty|nala|nina|nora|olive|opal|pearl|penny|piper|poppy|queenie|riley|rosie|ruby|sable|sasha|stella|suki|tilly|uma|vera|violet|willa|willow|winnie|xena|yara|yuna|zara|zoe|zola)$/i.test(
      lower,
    )
  ) {
    return ['girl', 'neutral'];
  }
  if (
    /^(oliver|simba|leo|max|felix|jasper|tiger|oscar|jack|theo|buddy|cooper|rocky|duke|zeus|jax|finn|hugo|archie|bruno|jett|jude|knox|ace|apollo|arlo|atlas|axel|bandit|bear|blaze|bolt|boomer|buster|cash|charlie|chase|cosmo|diesel|duke|echo|enzo|finn|ghost|gunner|hank|hawk|hero|hudson|jax|jet|king|knox|koda|loki|louie|marley|maverick|milo|murphy|nash|nemo|odin|oreo|otto|pax|pixel|rex|rocky|romeo|scout|shadow|simba|spike|storm|tank|teddy|thor|toby|tucker|vince|wolf|winston|xander|yogi|zane|zeke|zeus|ziggy)$/i.test(
      lower,
    )
  ) {
    return ['boy', 'neutral'];
  }
  return fallback;
}

async function fetchNycFrequencies() {
  if (SKIP_NYC) {
    console.log('NYC skipped (SKIP_NYC=1) — using local seed + supplement only');
    return false;
  }
  const url =
    'https://data.cityofnewyork.us/resource/nu7n-tubp.json?' +
    new URLSearchParams({
      $select: 'animalname,animalgender,count(*) as cnt',
      $group: 'animalname,animalgender',
      $where:
        "animalname is not null AND animalname not like '%UNKNOWN%' AND animalname not like '%NOT PROVIDED%'",
      $limit: '50000',
    });
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`NYC HTTP ${res.status}`);
    const rows = await res.json();
    for (const row of rows) {
      const name = cleanName(row.animalname);
      if (!name) continue;
      const g = String(row.animalgender || '').toUpperCase();
      const cnt = Number(row.cnt) || 0;
      const cur = nyc.get(name) || { count: 0, male: 0, female: 0 };
      cur.count += cnt;
      if (g === 'M') cur.male += cnt;
      if (g === 'F') cur.female += cnt;
      nyc.set(name, cur);
    }
    console.log('NYC rows aggregated:', nyc.size, 'distinct names');
    return true;
  } catch (err) {
    const msg = err?.name === 'AbortError' ? `timeout ${NYC_TIMEOUT_MS}ms` : err.message;
    console.warn('NYC fetch skipped:', msg);
    return false;
  }
}

function pruneTopsToPool(names, nameSet, countBase = 100) {
  const out = [];
  const seen = new Set();
  for (const raw of names) {
    const name = cleanName(typeof raw === 'string' ? raw : raw?.name);
    if (!name || !nameSet.has(name) || seen.has(name)) continue;
    seen.add(name);
    const count = typeof raw === 'object' && raw?.count != null ? Number(raw.count) : countBase - out.length;
    out.push({ name, count });
    if (out.length >= 24) break;
  }
  return out;
}

function heuristicBreedAffinity(nameSet) {
  /** @type {Record<string, { query: string, topNames: { name: string, count: number }[] }>} */
  const breeds = {};
  for (const [id, names] of Object.entries(HEURISTIC_BREED_TOPS)) {
    const topNames = pruneTopsToPool(names, nameSet);
    if (topNames.length) breeds[id] = { query: `heuristic:${id}`, topNames };
  }
  return breeds;
}

async function fetchNycBreedAffinity(dogNameSet, catNameSet, nycOk) {
  const targets = {
    labrador: { query: '%Labrador%', like: '%Labrador%' },
    'golden-retriever': { query: '%Golden Retriever%', like: '%Golden Retriever%' },
    'french-bulldog': { query: '%French Bull%', like: '%French Bull%' },
    'german-shepherd': { query: '%German Shepherd%', like: '%German Shepherd%' },
    poodle: { query: '%Poodle%', like: '%Poodle%' },
    beagle: { query: '%Beagle%', like: '%Beagle%' },
    bulldog: { query: '%Bulldog% not French', like: '%Bulldog%', excludeLike: '%French%' },
    'yorkshire-terrier': { query: '%Yorkshire%', like: '%Yorkshire%' },
    husky: { query: '%Husky%', like: '%Husky%' },
    corgi: { query: '%Corgi%', like: '%Corgi%' },
    'shih-tzu': { query: '%Shih Tzu%', like: '%Shih Tzu%' },
    dachshund: { query: '%Dachshund%', like: '%Dachshund%' },
    pomeranian: { query: '%Pomeranian%', like: '%Pomeranian%' },
  };

  const breedWord = /^(french|poodle|husky|corgi|pomeranian|dachshund|yorkie|golden|labrador)$/i;
  /** @type {Record<string, { query: string, topNames: { name: string, count: number }[] }>} */
  const nycBreeds = {};

  // Don't hammer 13 breed endpoints when frequency fetch already failed (403/timeout)
  if (nycOk && !SKIP_NYC) {
    for (const [id, spec] of Object.entries(targets)) {
      let where = `breedname like '${spec.like.replace(/'/g, "''")}' AND animalname is not null AND upper(animalname) not like '%UNKNOWN%' AND upper(animalname) not like '%NOT PROVIDED%'`;
      if (spec.excludeLike) {
        where += ` AND breedname not like '${spec.excludeLike.replace(/'/g, "''")}'`;
      }
      const url =
        'https://data.cityofnewyork.us/resource/nu7n-tubp.json?' +
        new URLSearchParams({
          $select: 'animalname,count(*) as cnt',
          $group: 'animalname',
          $where: where,
          $order: 'cnt DESC',
          $limit: '80',
        });
      try {
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        const topNames = [];
        for (const row of rows) {
          const name = cleanName(row.animalname);
          if (!name || breedWord.test(name)) continue;
          if (!dogNameSet.has(name)) continue;
          topNames.push({ name, count: Number(row.cnt) || 0 });
          if (topNames.length >= 24) break;
        }
        if (topNames.length) {
          nycBreeds[id] = { query: spec.query, topNames };
          console.log('NYC breed affinity', id, topNames.length, 'in-pool names');
        }
      } catch (err) {
        const msg = err?.name === 'AbortError' ? `timeout ${NYC_TIMEOUT_MS}ms` : err.message;
        console.warn('NYC breed affinity skipped for', id, msg);
        // First breed failure after ok frequency is rare; keep going with short timeouts only
      }
    }
  } else {
    console.log('NYC breed affinity skipped — using heuristic + preserved tops');
  }

  // Always merge heuristic (dogs + cats) so every breed filter links to in-pool names
  const allNameSet = new Set([...dogNameSet, ...catNameSet]);
  const breeds = { ...heuristicBreedAffinity(allNameSet) };
  for (const [id, row] of Object.entries(nycBreeds)) {
    const merged = pruneTopsToPool(
      [...(row.topNames || []), ...(breeds[id]?.topNames || []).map((t) => t.name)],
      dogNameSet,
    );
    breeds[id] = { query: row.query, topNames: merged.length ? merged : breeds[id]?.topNames || [] };
  }

  // Preserve previous NYC tops if this run got nothing from API (403) but file had data
  const prevPath = join(outDir, 'breed-name-affinity.json');
  if (Object.keys(nycBreeds).length === 0 && existsSync(prevPath)) {
    try {
      const prev = JSON.parse(readFileSync(prevPath, 'utf8'));
      for (const [id, row] of Object.entries(prev.breeds || {})) {
        if (!id || !HEURISTIC_BREED_TOPS[id]) continue;
        const pruned = pruneTopsToPool(row.topNames || [], dogNameSet);
        if (pruned.length >= (breeds[id]?.topNames?.length || 0)) {
          breeds[id] = { query: row.query || `preserved:${id}`, topNames: pruned };
        }
      }
      console.log('Preserved prior breed affinity where NYC was unavailable');
    } catch {
      /* ignore */
    }
  }

  const payload = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source:
      Object.keys(nycBreeds).length > 0
        ? 'NYC Dog Licensing Dataset + heuristic breed anchors (in-pool only)'
        : 'Heuristic breed anchors (NYC unavailable); prior NYC tops preserved when present',
    note: 'Every topName exists in dog-names.json or cat-names.json so breed × letter × vibe stay linked.',
    breeds,
  };
  writeFileSync(join(outDir, 'breed-name-affinity.json'), JSON.stringify(payload, null, 2) + '\n');
  console.log('Wrote breed-name-affinity.json for', Object.keys(breeds).length, 'breeds');
}

function padToTarget(entries, species) {
  const existing = new Set(entries.map((e) => e.name.toLowerCase()));
  let added = 0;
  let i = 0;
  for (const raw of POOL_SUPPLEMENT) {
    if (entries.length >= TARGET) break;
    const name = cleanName(raw);
    if (!name || existing.has(name.toLowerCase())) continue;
    const popularity = popularityFromNyc(name, Math.max(28, 78 - Math.floor(i / 12)));
    const gender = genderFromNyc(nyc.get(name), genderHeuristic(name, ['neutral']));
    entries.push({
      name,
      gender,
      vibes: vibeGuess(name, popularity),
      popularity,
      sources: ['pool-supplement'],
    });
    existing.add(name.toLowerCase());
    added++;
    i++;
  }

  // Still short of TARGET → letter + pet-like tails (offline, reproducible)
  const tails = [
    'umi', 'ora', 'iko', 'ara', 'eno', 'ira', 'avi', 'elo', 'ony', 'eon', 'axi', 'ula', 'eva', 'inx',
    'oss', 'ade', 'orn', 'iby', 'une', 'ell', 'ash', 'ove', 'een', 'iff', 'owl', 'isk', 'olt', 'yne',
  ];
  let synth = 0;
  outer: for (const L of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (entries.length >= TARGET) break;
    for (const tail of tails) {
      if (entries.length >= TARGET) break outer;
      const name = cleanName(L + tail);
      if (!name || name.length < 3 || name.length > 10 || existing.has(name.toLowerCase())) continue;
      const popularity = 30 + ((synth + L.charCodeAt(0)) % 35);
      entries.push({
        name,
        gender: genderHeuristic(name, ['neutral']),
        vibes: vibeGuess(name, popularity, 'pool-synthesize'),
        popularity,
        sources: ['pool-synthesize'],
      });
      existing.add(name.toLowerCase());
      added++;
      synth++;
    }
  }

  console.log(`${species}: pool-supplement/synth added`, added, 'names →', entries.length);
  return entries;
}

/** Ensure boy/girl tags exist across letters so gender × letter combos associate. */
function ensureGenderLetterSpread(entries) {
  const byLetter = new Map();
  for (const e of entries) {
    const L = e.name[0].toUpperCase();
    if (!byLetter.has(L)) byLetter.set(L, []);
    byLetter.get(L).push(e);
  }
  for (const [, list] of byLetter) {
    let boys = list.filter((e) => e.gender.includes('boy')).length;
    let girls = list.filter((e) => e.gender.includes('girl')).length;
    if (boys < 3) {
      for (const e of list) {
        if (e.gender.includes('boy')) continue;
        if (/[oax]$/i.test(e.name) || e.name.length <= 4) {
          e.gender = [...new Set([...e.gender, 'boy', 'neutral'])];
          if (++boys >= 3) break;
        }
      }
    }
    if (girls < 3) {
      for (const e of list) {
        if (e.gender.includes('girl')) continue;
        if (/[ayi]$/i.test(e.name) || /(ie|elle|ina)$/i.test(e.name.toLowerCase())) {
          e.gender = [...new Set([...e.gender, 'girl', 'neutral'])];
          if (++girls >= 3) break;
        }
      }
    }
  }
  return entries;
}

/** Letter fillers so A–Z always associates (curated supplement, not third-party scrape). */
const LETTER_FILLERS = {
  A: ['Ace', 'Ash', 'Atlas', 'Amber', 'Aria', 'Arrow', 'April', 'Axel', 'Annie', 'Archie', 'Aspen', 'Aurora', 'Ava', 'Apollo', 'Arlo', 'Ada', 'Aiden', 'Alfie'],
  B: ['Bolt', 'Basil', 'Briar', 'Biscuit', 'Button', 'Blaze', 'Blue', 'Bowie', 'Brooks', 'Bonnie', 'Bambi', 'Becks', 'Birdie', 'Boomer', 'Bubbles', 'Butter', 'Byte', 'Banjo'],
  C: ['Cedar', 'Cipher', 'Clover', 'Cosmo', 'Cricket', 'Coral', 'Clyde', 'Cleo', 'Cash', 'Cinnamon', 'Cloud', 'Comet', 'Cupcake', 'Cub', 'Cyrus', 'Coda', 'Cali', 'Chip'],
  D: ['Dash', 'Dex', 'Dove', 'Drift', 'Dashi', 'Dune', 'Dottie', 'Diesel', 'Dax', 'Delta', 'Domino', 'Doodle', 'Dusty', 'Dream', 'Duke', 'Daisy', 'Dory', 'Drake'],
  E: ['Echo', 'Ember', 'Eden', 'Ellis', 'Ezra', 'Elsa', 'Eddie', 'Elm', 'Enzo', 'Erin', 'Evie', 'Ever', 'Eclipse', 'Elfie', 'Emmy', 'Eric', 'Eva', 'Eddy'],
  F: ['Fig', 'Fizz', 'Frost', 'Fern', 'Fox', 'Fable', 'Flint', 'Flora', 'Frankie', 'Finn', 'Fudge', 'Fuzzy', 'Floyd', 'Freya', 'Fiona', 'Felix', 'Forest', 'Foxy'],
  G: ['Goose', 'Gatsby', 'Grove', 'Ginger', 'Ghost', 'Gizmo', 'Gale', 'Goldie', 'Greyson', 'Greta', 'Gigi', 'Gunner', 'Garnet', 'Glyph', 'Gumdrop', 'Gus', 'Gwen', 'Glen'],
  H: ['Hazel', 'Harbor', 'Hawk', 'Honey', 'Hugo', 'Halo', 'Hero', 'Holly', 'Hank', 'Harper', 'Heath', 'Huxley', 'Hope', 'Harley', 'Hershey', 'Hudson', 'Heidi', 'Haze'],
  I: ['Indigo', 'Ink', 'Ivy', 'Iris', 'Iggy', 'Ivory', 'Ian', 'Isa', 'Ike', 'Ice', 'Icon', 'Ida', 'Inky', 'Isla', 'Iori', 'Ira', 'Izzy', 'Io'],
  J: ['Jinx', 'Jett', 'Juno', 'Jude', 'Jules', 'Juniper', 'Jasper', 'Jack', 'Jade', 'Jazz', 'Joey', 'Joy', 'Jelly', 'Joni', 'Juno', 'Jett', 'Jax', 'Jem'],
  K: ['Kai', 'Kiki', 'Knox', 'Koda', 'Karma', 'Kit', 'Kiki', 'Kane', 'Kira', 'Koala', 'Kurt', 'Kettle', 'Kite', 'Koko', 'Kyle', 'Kaya', 'Kobe', 'Kiki'],
  L: ['Lumen', 'Lynx', 'Lark', 'Lux', 'Lotus', 'Lucky', 'Lola', 'Leo', 'Luna', 'Lily', 'Lex', 'Lumen', 'Lime', 'Loki', 'Lacey', 'Lane', 'Lou', 'Lux'],
  M: ['Maple', 'Miso', 'Moss', 'Mochi', 'Mango', 'Misty', 'Milo', 'Max', 'Mabel', 'Marlow', 'Mint', 'Moon', 'Muffin', 'Murphy', 'Macy', 'Mika', 'Mose', 'Moxie'],
  N: ['Nova', 'Nyx', 'Nori', 'Nimbus', 'Nala', 'Ned', 'Nell', 'Nash', 'Nemo', 'Nina', 'Noir', 'Nutmeg', 'Navy', 'Nico', 'Nellie', 'Nate', 'Nola', 'Nyx'],
  O: ['Onyx', 'Opal', 'Otto', 'Olive', 'Odin', 'Oak', 'Ora', 'Ozzy', 'Ollie', 'Opie', 'Orbit', 'Oscar', 'Otter', 'Owen', 'Ora', 'Otis', 'Oz', 'Oona'],
  P: ['Pax', 'Pepper', 'Pixel', 'Pip', 'Pearl', 'Pine', 'Poppy', 'Primo', 'Puck', 'Pudding', 'Pulse', 'Piper', 'Pesto', 'Pace', 'Penny', 'Primo', 'Poe', 'Plum'],
  Q: ['Quill', 'Quinn', 'Quest', 'Quincy', 'Queen', 'Quokka', 'Quilt', 'Quillow', 'Quip', 'Quark', 'Quincy', 'Questa', 'Quill', 'Quin', 'Queso', 'Quillan', 'Quorra', 'Qubit'],
  R: ['Remy', 'River', 'Roux', 'Raven', 'Rex', 'Riley', 'Rosie', 'Rune', 'Rocket', 'Ruby', 'Rune', 'Ridge', 'Rory', 'Rain', 'Rune', 'Rio', 'Ritz', 'Rune'],
  S: ['Sage', 'Sable', 'Storm', 'Scout', 'Shadow', 'Sunny', 'Suki', 'Sonic', 'Sprig', 'Star', 'Soot', 'Spice', 'Spike', 'Sable', 'Sky', 'Sol', 'Syd', 'Sprout'],
  T: ['Tofu', 'Toast', 'Thor', 'Tiger', 'Tilly', 'Toby', 'Tango', 'Tide', 'Trinket', 'Theo', 'Tess', 'Torch', 'Taffy', 'Trek', 'Tux', 'Tansy', 'Tone', 'Tripp'],
  U: ['Uma', 'Uri', 'Umbra', 'Unity', 'Ugo', 'Uli', 'Umi', 'Uno', 'Urban', 'Uriel', 'Usha', 'Uli', 'Ube', 'Uliya', 'Udo', 'Ulla', 'Uriah', 'Ume'],
  V: ['Vesper', 'Violet', 'Vega', 'Vince', 'Vera', 'Vivi', 'Volt', 'Valor', 'Vixen', 'Vale', 'Vinny', 'Veda', 'Vesper', 'Vic', 'Vera', 'Vito', 'Voyage', 'Vibe'],
  W: ['Wren', 'Wisp', 'Willow', 'Wolf', 'Waffles', 'Winnie', 'Wade', 'Wren', 'Whisk', 'Walt', 'Wendy', 'Wicks', 'Windy', 'Wynn', 'Wolfie', 'Wren', 'Wes', 'Willa'],
  X: ['Xander', 'Xena', 'Xerox', 'Xavi', 'Xyla', 'Xion', 'Xabi', 'Xerxes', 'Xena', 'Xavi', 'Xyla', 'Xeno', 'Xiah', 'Xuri', 'Xander', 'Xo', 'Xan', 'Xyra'],
  Y: ['Yara', 'Yuzu', 'Yves', 'Yuri', 'Yeti', 'Yara', 'YoYo', 'Yale', 'Yuna', 'York', 'Yara', 'Yumi', 'Yarrow', 'Yule', 'Yara', 'Yogi', 'Yuna', 'Yvie'],
  Z: ['Zeke', 'Zelda', 'Ziggy', 'Zorro', 'Zara', 'Zephyr', 'Zuzu', 'Zeke', 'Zion', 'Zia', 'Zoom', 'Zesty', 'Zeke', 'Zola', 'Zeke', 'Zuri', 'Zane', 'Zinnia'],
};

function dedupeFillers(list) {
  return [...new Set(list.map(cleanName).filter(Boolean))];
}

function ensureLetterCoverage(entries, species) {
  const byLetter = new Map();
  for (const e of entries) {
    const L = e.name[0].toUpperCase();
    if (!byLetter.has(L)) byLetter.set(L, []);
    byLetter.get(L).push(e);
  }

  const existing = new Set(entries.map((e) => e.name.toLowerCase()));
  let added = 0;

  for (const L of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    const have = byLetter.get(L)?.length || 0;
    if (have >= MIN_PER_LETTER) continue;
    const fillers = dedupeFillers(LETTER_FILLERS[L] || []);
    for (const name of fillers) {
      if ((byLetter.get(L)?.length || 0) >= MIN_PER_LETTER) break;
      if (existing.has(name.toLowerCase())) continue;
      if (name[0].toUpperCase() !== L) continue;
      const gender = genderHeuristic(name, ['neutral']);
      const popularity = 42 + (added % 25);
      const entry = {
        name,
        gender,
        vibes: vibeGuess(name, popularity),
        popularity,
        sources: ['letter-coverage-supplement'],
      };
      entries.push(entry);
      existing.add(name.toLowerCase());
      if (!byLetter.has(L)) byLetter.set(L, []);
      byLetter.get(L).push(entry);
      added++;
    }
  }

  console.log(`${species}: letter-coverage added`, added, 'names');
  return entries;
}

function ensureVibeGenderSpread(entries) {
  // Do NOT slap extra vibes onto every name — that made all styles look the same.
  // Only top up a vibe if the whole pool is critically thin (<12% of names).
  const vibeCounts = { cute: 0, strong: 0, unique: 0, classic: 0 };
  for (const e of entries) {
    for (const v of e.vibes) if (vibeCounts[v] != null) vibeCounts[v]++;
  }
  const minNeed = Math.max(80, Math.floor(entries.length * 0.12));
  for (const vibe of ['cute', 'strong', 'unique', 'classic']) {
    if (vibeCounts[vibe] >= minNeed) continue;
    for (const e of entries) {
      if (vibeCounts[vibe] >= minNeed) break;
      if (e.vibes.includes(vibe) || e.vibes.length >= 2) continue;
      const lower = e.name.toLowerCase();
      const ok =
        (vibe === 'cute' && /(y|ie|ey)$/.test(lower)) ||
        (vibe === 'strong' && e.name.length <= 4) ||
        (vibe === 'unique' && e.popularity < 50) ||
        (vibe === 'classic' && e.popularity >= 70);
      if (!ok) continue;
      e.vibes = [...e.vibes, vibe];
      vibeCounts[vibe]++;
    }
  }
  return entries;
}

function buildDogEntries() {
  /** @type {Map<string, any>} */
  const byName = new Map();

  dogMale.forEach((name, i) => {
    const n = cleanName(name);
    if (!n) return;
    const popList = popularityFromListIndex(i, dogMale.length);
    byName.set(n, {
      name: n,
      gender: ['boy'],
      vibes: vibeGuess(n, popList),
      popularity: popularityFromNyc(n, popList),
      sources: ['dog-names'],
    });
  });
  dogFemale.forEach((name, i) => {
    const n = cleanName(name);
    if (!n) return;
    const popList = popularityFromListIndex(i, dogFemale.length);
    const existing = byName.get(n);
    if (existing) {
      if (!existing.gender.includes('girl')) existing.gender.push('girl');
      if (existing.gender.includes('boy') && existing.gender.includes('girl') && !existing.gender.includes('neutral')) {
        existing.gender.push('neutral');
      }
      existing.popularity = Math.max(existing.popularity, popularityFromNyc(n, popList));
      existing.vibes = [...new Set([...existing.vibes, ...vibeGuess(n, existing.popularity)])];
    } else {
      byName.set(n, {
        name: n,
        gender: ['girl'],
        vibes: vibeGuess(n, popList),
        popularity: popularityFromNyc(n, popList),
        sources: ['dog-names'],
      });
    }
  });

  // Expand from NYC frequency ranking until TARGET
  const nycSorted = [...nyc.entries()].sort((a, b) => b[1].count - a[1].count);
  let rank = 0;
  for (const [name, hit] of nycSorted) {
    if (byName.size >= TARGET) break;
    rank++;
    const existing = byName.get(name);
    if (existing) {
      existing.sources = [...new Set([...(existing.sources || []), 'nyc-dog-licensing'])];
      existing.gender = genderFromNyc(hit, existing.gender);
      existing.popularity = Math.max(existing.popularity, popularityFromNyc(name, existing.popularity));
      continue;
    }
    const pop = popularityFromNyc(name, popularityFromListIndex(rank, TARGET));
    byName.set(name, {
      name,
      gender: genderFromNyc(hit, genderHeuristic(name)),
      vibes: vibeGuess(name, pop),
      popularity: pop,
      sources: ['nyc-dog-licensing'],
    });
  }

  let entries = [...byName.values()];
  entries = padToTarget(entries, 'dog');
  entries = ensureLetterCoverage(entries, 'dog');
  entries = applyStyleBanks(entries, 'dog');
  entries = sharpenVibes(entries);
  entries = ensureGenderLetterSpread(entries);
  entries = ensureVibeGenderSpread(entries);
  // Cap slightly over target after letter fill, keep highest popularity first
  entries.sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
  if (entries.length > TARGET + 80) {
    // Keep letter coverage: don't blindly slice — prefer keep all letters then trim uniques
    const keep = [];
    const letterKept = new Map();
    for (const e of entries) {
      const L = e.name[0].toUpperCase();
      const n = letterKept.get(L) || 0;
      if (n < MIN_PER_LETTER || keep.length < TARGET) {
        keep.push(e);
        letterKept.set(L, n + 1);
      }
    }
    entries = keep;
  }

  console.log('Dogs built:', entries.length);
  return entries.sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
}

function buildCatEntries() {
  /** @type {Map<string, any>} */
  const byName = new Map();

  catAll.forEach((name, i) => {
    const n = cleanName(name);
    if (!n) return;
    const popList = popularityFromListIndex(i, catAll.length);
    byName.set(n, {
      name: n,
      gender: genderHeuristic(n, ['neutral']),
      vibes: vibeGuess(n, popList),
      popularity: popList,
      sources: ['cat-names'],
    });
  });

  // Reuse NYC open pet-name frequency for cats (same naming culture; no open cat license set)
  const nycSorted = [...nyc.entries()].sort((a, b) => b[1].count - a[1].count);
  let rank = 0;
  for (const [name, hit] of nycSorted) {
    if (byName.size >= TARGET) break;
    rank++;
    if (byName.has(name)) {
      const existing = byName.get(name);
      existing.sources = [...new Set([...(existing.sources || []), 'nyc-dog-licensing'])];
      existing.gender = genderFromNyc(hit, existing.gender);
      existing.popularity = Math.max(existing.popularity, popularityFromNyc(name, existing.popularity));
      continue;
    }
    const pop = popularityFromNyc(name, popularityFromListIndex(rank, TARGET));
    byName.set(name, {
      name,
      gender: genderFromNyc(hit, genderHeuristic(name)),
      vibes: vibeGuess(name, pop),
      popularity: pop,
      sources: ['nyc-dog-licensing', 'pet-name-shared'],
    });
  }

  // Merge previous curated extra if present
  const extraPath = join(outDir, 'cat-names-extra.json');
  if (existsSync(extraPath)) {
    try {
      const extra = JSON.parse(readFileSync(extraPath, 'utf8'));
      for (const row of extra) {
        const n = cleanName(row.name);
        if (!n || byName.has(n)) continue;
        byName.set(n, {
          name: n,
          gender: row.gender || genderHeuristic(n),
          vibes: row.vibes || vibeGuess(n, row.popularity || 50),
          popularity: row.popularity || 50,
          sources: row.sources || ['curated-supplement'],
        });
      }
    } catch {
      /* ignore */
    }
  }

  let entries = [...byName.values()];
  entries = padToTarget(entries, 'cat');
  entries = ensureLetterCoverage(entries, 'cat');
  entries = applyStyleBanks(entries, 'cat');
  entries = sharpenVibes(entries);
  entries = ensureGenderLetterSpread(entries);
  entries = ensureVibeGenderSpread(entries);
  entries.sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));

  if (entries.length > TARGET + 80) {
    const keep = [];
    const letterKept = new Map();
    for (const e of entries) {
      const L = e.name[0].toUpperCase();
      const n = letterKept.get(L) || 0;
      if (n < MIN_PER_LETTER || keep.length < TARGET) {
        keep.push(e);
        letterKept.set(L, n + 1);
      }
    }
    entries = keep;
  }

  console.log('Cats built:', entries.length);
  return entries.sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
}

function printCoverage(label, entries) {
  const letters = {};
  const genders = { boy: 0, girl: 0, neutral: 0 };
  const vibes = { cute: 0, strong: 0, unique: 0, classic: 0 };
  for (const e of entries) {
    const L = e.name[0].toUpperCase();
    letters[L] = (letters[L] || 0) + 1;
    for (const g of e.gender) if (genders[g] != null) genders[g]++;
    for (const v of e.vibes) if (vibes[v] != null) vibes[v]++;
  }
  const thin = Object.entries(letters)
    .filter(([, n]) => n < MIN_PER_LETTER)
    .map(([L, n]) => `${L}:${n}`);
  console.log(label, 'n=', entries.length, 'genders', genders, 'vibes', vibes);
  if (thin.length) console.warn(label, 'thin letters', thin.join(', '));
  else console.log(label, 'all letters >=', MIN_PER_LETTER);
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
| [NYC Dog Licensing Dataset](https://data.cityofnewyork.us/Health/NYC-Dog-Licensing-Dataset/nu7n-tubp) | NYC Open Data | Frequency / gender; expand to ~1000; breed×name affinity (in-pool only) |
| Letter coverage + pool supplement | Curated in build scripts | Ensure ~1000 names and A–Z / breed filters always associate |
| Breed affinity (heuristic, NYC when available) | Open / curated | Only names that exist in the species pool |

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

const nycOk = await fetchNycFrequencies();
const dogs = buildDogEntries();
const cats = buildCatEntries();
await fetchNycBreedAffinity(
  new Set(dogs.map((d) => d.name)),
  new Set(cats.map((c) => c.name)),
  nycOk,
);
const tarot = buildTarot();

printCoverage('dogs', dogs);
printCoverage('cats', cats);

writeFileSync(join(outDir, 'dog-names.json'), JSON.stringify(dogs, null, 2) + '\n');
writeFileSync(join(outDir, 'cat-names.json'), JSON.stringify(cats, null, 2) + '\n');
writeFileSync(join(outDir, 'tarot-meanings.json'), JSON.stringify(tarot, null, 2) + '\n');
writeAttribution();
copyLicenses();

console.log('Wrote', dogs.length, 'dog names,', cats.length, 'cat names,', tarot.length, 'tarot cards');
console.log('Output:', outDir);
