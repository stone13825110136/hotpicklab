import trendFaqs from '../data/trend-faqs.json';

export type TrendFaqItem = {
  question: string;
  answer: string;
};

export function getTrendFaqs(slug: string): TrendFaqItem[] {
  const map = trendFaqs as Record<string, TrendFaqItem[] | string>;
  const items = map[slug];
  if (!items || !Array.isArray(items)) return [];
  return items;
}
