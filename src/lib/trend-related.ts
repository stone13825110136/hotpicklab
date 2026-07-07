import trends from '../data/trends.json';

export type TrendSummary = {
  slug: string;
  title: string;
  summary: string;
};

export function getRelatedTrends(slug: string, limit = 3): TrendSummary[] {
  const current = trends.find((t) => t.slug === slug);
  if (!current) return [];

  const others = trends.filter((t) => t.slug !== slug);
  const sameCategory = others
    .filter((t) => t.category === current.category)
    .sort((a, b) => b.trendScore - a.trendScore);

  const picked = [...sameCategory];
  if (picked.length < limit) {
    for (const t of others.sort((a, b) => b.trendScore - a.trendScore)) {
      if (picked.some((p) => p.slug === t.slug)) continue;
      picked.push(t);
      if (picked.length >= limit) break;
    }
  }

  return picked.slice(0, limit).map((t) => ({
    slug: t.slug,
    title: t.title,
    summary: t.summary,
  }));
}
