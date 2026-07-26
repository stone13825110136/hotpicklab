import type { TarotCard } from './types';

/** Stable 32-bit hash for a name (same name → same fortune). */
export function hashName(name: string): number {
  const s = name.trim().toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickTarot(name: string, deck: TarotCard[]): TarotCard {
  if (!deck.length) {
    return { id: 0, name: 'The Star', vibe: 'Bright and memorable.' };
  }
  const idx = hashName(name) % deck.length;
  return deck[idx]!;
}
