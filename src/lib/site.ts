export const SITE = {
  name: 'HotPick Lab',
  tagline: 'Buying research for trending products.',
  description:
    'Independent buying briefs for US shoppers and short-form creators — structured verdicts on viral Amazon products, AI tools, and seasonal deals.',
  url: 'https://hotpicklab.com',
  author: 'HotPick Lab Editorial',
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
