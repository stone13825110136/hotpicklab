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

export function filterNames(
  pool: NameEntry[],
  gender: Gender,
  vibe: Vibe,
  count = 18,
): ScoredName[] {
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

  // Prefer vibe matches first, then fill
  const vibeFirst = matched.filter((n) => n.vibes.includes(vibe));
  const rest = matched.filter((n) => !n.vibes.includes(vibe));
  const picked = [...vibeFirst, ...rest].slice(0, count);

  // If too few for strict gender, widen to neutral-inclusive
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
