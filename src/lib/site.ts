export const SITE = {
  name: 'HotPick Lab',
  tagline: "What's trending. What's worth it.",
  description:
    'Curated hotspot buying guides and free tools for the US market — honest picks, clear comparisons, updated weekly.',
  url: 'https://hotpicklab.com',
  author: 'HotPick Lab',
  contactEmail: 'contact@hotpicklab.com',
  locale: 'en-US',
};

export const AFFILIATE_DISCLOSURE =
  'We may earn a commission when you buy through links on this page. This helps keep our tools free.';

export const CATEGORIES: Record<string, string> = {
  'ai-tools': 'AI Tools',
  'amazon-trending': 'Amazon Trending',
  gaming: 'Gaming',
  seasonal: 'Seasonal',
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
