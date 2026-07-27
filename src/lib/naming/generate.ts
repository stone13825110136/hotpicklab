import type { Gender, NameEntry, ScoredName, Vibe } from './types';
import { pickTarot } from './hash';
import type { TarotCard } from './types';

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
  const vibeHit = entry.vibes.includes(vibe) ? 100 : entry.vibes.length ? 60 : 50;
  return Math.round(pop * 0.35 + len * 0.25 + call * 0.2 + vibeHit * 0.2);
}

/** Full ranked pool: vibe matches first, then by practical score. Stable order (not shuffled). */
export function rankNames(pool: NameEntry[], gender: Gender, vibe: Vibe): ScoredName[] {
  const genderOk = (n: NameEntry) => {
    if (gender === 'neutral') return true; // Neutral = any / unisex-friendly mix
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

  // Prefer vibe matches first, then the rest of the gender-filtered pool
  const vibeFirst = matched.filter((n) => n.vibes.includes(vibe));
  const rest = matched.filter((n) => !n.vibes.includes(vibe));
  const ranked = [...vibeFirst, ...rest];

  // If gender filter left the list thin, append remaining pool by score (deduped)
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

/** One page from the ranked pool. offset=0 is the top-score shortlist. */
export function filterNames(
  pool: NameEntry[],
  gender: Gender,
  vibe: Vibe,
  count = 18,
  offset = 0,
): ScoredName[] {
  return rankNames(pool, gender, vibe).slice(offset, offset + count);
}

export function attachFortune(names: ScoredName[], deck: TarotCard[]): ScoredName[] {
  return names.map((n) => ({
    ...n,
    tarot: pickTarot(n.name, deck),
    // Keep reason for Hot Pick as practical — tarot is fun flavor only
    reason: practicalReason(n),
  }));
}

function practicalReason(n: ScoredName): string {
  const tags = n.tags.filter((t) => t !== 'popular').slice(0, 2).join(' · ') || 'balanced';
  return `Highest practical score in your shortlist (${n.practical}/100) — easy to call with a strong ${tags} fit.`;
}

/** Hot Pick = highest practical score among compared names. Tarot does not decide the winner. */
export function chooseHotPick(compared: ScoredName[]): ScoredName | null {
  if (!compared.length) return null;
  const ranked = [...compared].sort((a, b) => b.practical - a.practical || a.name.localeCompare(b.name));
  const best = ranked[0]!;
  return {
    ...best,
    reason: practicalReason(best),
  };
}
