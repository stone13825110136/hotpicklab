import type { Gender, NameEntry, RankFilters, RankResultMeta, ScoredName, Vibe } from './types';
import { breedAffinityScore, getBreedProfile, matchesLetter } from './breeds';
import { pickTarot } from './hash';
import type { TarotCard } from './types';

const LETTER_SOFT_MIN = 12;

function lengthScore(name: string): number {
  const n = name.length;
  if (n >= 3 && n <= 6) return 100;
  if (n === 2 || n === 7) return 85;
  if (n === 8) return 70;
  if (n < 2) return 40;
  return 55;
}

function callScore(name: string): number {
  const vowels = (name.match(/[aeiouy]/gi) || []).length;
  const ratio = vowels / Math.max(name.length, 1);
  if (ratio >= 0.3 && ratio <= 0.55) return 95;
  if (ratio >= 0.2 && ratio < 0.3) return 75;
  return 55;
}

export function practicalScore(entry: NameEntry, vibe: Vibe): number {
  const pop = entry.popularity;
  const len = lengthScore(entry.name);
  const call = callScore(entry.name);
  const vibeHit = entry.vibes.includes(vibe)
    ? entry.vibes.length === 1
      ? 100
      : 82
    : entry.vibes.length
      ? 55
      : 50;
  return Math.round(pop * 0.35 + len * 0.25 + call * 0.2 + vibeHit * 0.2);
}

function isSynth(n: NameEntry): boolean {
  return (n.sources || []).includes('pool-synthesize');
}

function isFlagship(n: NameEntry): boolean {
  return (n.sources || []).includes('style-flagship');
}

function exclusiveVibe(n: NameEntry, vibe: Vibe): boolean {
  return n.vibes.length === 1 && n.vibes[0] === vibe;
}

/** Customer-facing tags: selected vibe first (single), plus optional fit flags. */
export function displayTags(n: ScoredName, vibe: Vibe): string[] {
  const primary = n.vibes.includes(vibe) ? vibe : n.vibes[0];
  const out: string[] = [];
  if (primary) out.push(primary);
  if (n.breedFit) out.push('breed fit');
  if (n.letterMatch) out.push('letter match');
  return out;
}

function scoreEntry(n: NameEntry, vibe: Vibe, filters?: RankFilters, letterMatch = false): ScoredName {
  const practical = practicalScore(n, vibe);
  const profile = getBreedProfile(filters?.breedId);
  const { score: breedAffinity, fit: breedFit } = breedAffinityScore(n.name, n.vibes, profile);
  const tags = displayTags(
    {
      ...n,
      practical,
      breedFit,
      breedAffinity,
      letterMatch,
      tags: [],
    },
    vibe,
  );
  return {
    ...n,
    practical,
    breedFit,
    breedAffinity,
    letterMatch,
    tags,
  };
}

function sortScored(a: ScoredName, b: ScoredName, vibe: Vibe): number {
  const aL = a.letterMatch ? 1 : 0;
  const bL = b.letterMatch ? 1 : 0;
  if (bL !== aL) return bL - aL;

  const aV = a.vibes.includes(vibe) ? 1 : 0;
  const bV = b.vibes.includes(vibe) ? 1 : 0;
  if (bV !== aV) return bV - aV;

  // Exclusive flagship / single-vibe before muddy dual tags
  const aEx = exclusiveVibe(a, vibe) ? 1 : 0;
  const bEx = exclusiveVibe(b, vibe) ? 1 : 0;
  if (bEx !== aEx) return bEx - aEx;

  const aF = isFlagship(a) ? 1 : 0;
  const bF = isFlagship(b) ? 1 : 0;
  if (bF !== aF) return bF - aF;

  // Letter-synth fillers sink (especially Unique trays)
  const aS = isSynth(a) ? 0 : 1;
  const bS = isSynth(b) ? 0 : 1;
  if (bS !== aS) return bS - aS;

  const aB = a.breedAffinity ?? 0;
  const bB = b.breedAffinity ?? 0;
  if (bB !== aB) return bB - aB;
  return b.practical - a.practical || a.name.localeCompare(b.name);
}

export type RankNamesResult = {
  names: ScoredName[];
  meta: RankResultMeta;
};

/** Ranked pool with letter preference + optional soft-fill when too few exact letter hits. */
export function rankNamesDetailed(
  pool: NameEntry[],
  gender: Gender,
  vibe: Vibe,
  filters: RankFilters = {},
): RankNamesResult {
  const letter = filters.letter?.trim() || '';
  const genderOk = (n: NameEntry) => {
    if (gender === 'neutral') return true;
    return n.gender.includes(gender) || n.gender.includes('neutral');
  };

  const genderPool = pool.filter(genderOk);
  const letterExact = letter
    ? genderPool.filter((n) => matchesLetter(n.name, letter))
    : genderPool;

  const letterExactCount = letter ? letterExact.length : genderPool.length;

  let working = letterExact;
  let letterSoftened = false;

  // Too few exact letter hits → keep letter matches first, then fill from gender pool
  if (letter && letterExact.length < LETTER_SOFT_MIN) {
    letterSoftened = true;
    const exactNames = new Set(letterExact.map((n) => n.name));
    working = [...letterExact, ...genderPool.filter((n) => !exactNames.has(n.name))];
  }

  const matched = working
    .map((n) => scoreEntry(n, vibe, filters, letter ? matchesLetter(n.name, letter) : false))
    .sort((a, b) => sortScored(a, b, vibe));

  const vibeFirst = matched.filter((n) => n.vibes.includes(vibe));
  const rest = matched.filter((n) => !n.vibes.includes(vibe));
  let ranked = [...vibeFirst, ...rest];

  // Still thin (no letter / tiny gender slice) → append rest of pool
  if (ranked.length < 18) {
    const wider = pool
      .map((n) => scoreEntry(n, vibe, filters, letter ? matchesLetter(n.name, letter) : false))
      .sort((a, b) => sortScored(a, b, vibe));
    const names = new Set(ranked.map((p) => p.name));
    for (const w of wider) {
      if (names.has(w.name)) continue;
      ranked.push(w);
      names.add(w.name);
    }
    if (letter && letterExactCount < LETTER_SOFT_MIN) letterSoftened = true;
  }

  return {
    names: ranked,
    meta: { letterExactCount: letter ? letterExactCount : ranked.length, letterSoftened },
  };
}

/** Full ranked pool (compat). */
export function rankNames(
  pool: NameEntry[],
  gender: Gender,
  vibe: Vibe,
  filters: RankFilters = {},
): ScoredName[] {
  return rankNamesDetailed(pool, gender, vibe, filters).names;
}

/** One page from the ranked pool. offset=0 is the top-score shortlist. */
export function filterNames(
  pool: NameEntry[],
  gender: Gender,
  vibe: Vibe,
  count = 18,
  offset = 0,
  filters: RankFilters = {},
): ScoredName[] {
  return rankNames(pool, gender, vibe, filters).slice(offset, offset + count);
}

export function attachFortune(names: ScoredName[], deck: TarotCard[]): ScoredName[] {
  return names.map((n) => ({
    ...n,
    tarot: pickTarot(n.name, deck),
    reason: practicalReason(n),
  }));
}

function practicalReason(n: ScoredName): string {
  const tags =
    n.tags.filter((t) => t !== 'popular' && t !== 'breed fit' && t !== 'letter match').slice(0, 2).join(' · ') ||
    'balanced';
  return `Highest practical score in your shortlist (${n.practical}/100) — easy to call with a strong ${tags} fit.`;
}

/** Hot Pick = highest practical score among compared names. */
export function chooseHotPick(compared: ScoredName[]): ScoredName | null {
  if (!compared.length) return null;
  const ranked = [...compared].sort((a, b) => b.practical - a.practical || a.name.localeCompare(b.name));
  const best = ranked[0]!;
  return {
    ...best,
    reason: practicalReason(best),
  };
}
