export const SITE = {
  name: 'HotPick Lab',
  tagline: 'Name it, draw it, pick it.',
  description:
    'Free pet name generator for dogs and cats. Shortlist scored dog names and cat names, compare favorites, and get one Hot Pick. Fun vibe cards are entertainment only — not a prediction.',
  url: 'https://hotpicklab.com',
  author: 'HotPick Lab',
  contactEmail: 'contact@hotpicklab.com',
  locale: 'en-US',
  productName: 'Pet Name Lab',
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
