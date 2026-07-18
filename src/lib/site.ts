export const SITE = {
  name: 'HotPick Lab',
  tagline: 'Pain-point research before you write more code.',
  description:
    'For builders who can ship with Cursor or AI tools but fear building blind. Public Reddit and Hacker News evidence, filtered for pay signals, with a one-week validation plan — delivered by email. $49. 7-day money-back.',
  url: 'https://hotpicklab.com',
  author: 'HotPick Lab',
  contactEmail: 'contact@hotpicklab.com',
  locale: 'en-US',
  priceUsd: 49,
  productName: 'Pain Point Research Report',
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
