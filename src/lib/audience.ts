export type Persona = {
  id: string;
  title: string;
  subtitle: string;
  scenario: string;
  searches: string[];
  pain: string;
  weDeliver: string[];
  exploreLabel: string;
  exploreHref: string;
};

export const AUDIENCE = {
  mission:
    'Help US shoppers and creators make a confident buy-or-skip decision on trending products — in one structured brief, not a hype scroll.',
  primaryLabel: 'Who we serve',
  notForLabel: 'Who we are not for',
  notFor: [
    'Deal hunters who only want the lowest coupon code — try Slickdeals or Honey instead.',
    'Readers who need lab-grade testing — Wirecutter and RTINGS go deeper on hardware.',
    'Shoppers outside the US — our picks, prices, and links target Amazon.com and US retailers.',
  ],
  personas: [
    {
      id: 'amazon-shopper',
      title: 'Pre-purchase Amazon shoppers',
      subtitle: 'Viral finds, real hesitation',
      scenario:
        'You saw a Stanley tumbler, neck fan, or nugget ice maker on TikTok or Reddit. You are ready to buy — but only if it fits your life.',
      searches: ['stanley vs owala worth it', 'portable fan amazon 2026', 'is blendjet worth it'],
      pain: 'Amazon reviews are noisy. Reddit threads are scattered. You want a clear skip list, not another “top 10”.',
      weDeliver: [
        'Buy / Skip / Wait verdict in the first scroll',
        '2–4 compared picks with honest cons',
        'Who should skip — before you checkout',
      ],
      exploreLabel: 'Browse Amazon briefs',
      exploreHref: '/trends',
    },
    {
      id: 'creator',
      title: 'Short-form creators',
      subtitle: 'Picking AI tools without wasting subscriptions',
      scenario:
        'You post Shorts, Reels, or TikTok and need the right AI video or photo tool for your budget and workflow.',
      searches: ['best ai video generator 2026', 'runway vs pika', 'ai photo enhancer for creators'],
      pain: 'Credit pricing is confusing. Every tool claims to be “best”. You need a tier that matches how often you post.',
      weDeliver: [
        'Tool comparisons by skill level and budget',
        'Pitfalls like credit burn and export sizes',
        'Free calculators for aspect ratios and deals',
      ],
      exploreLabel: 'Browse creator tool briefs',
      exploreHref: '/trends/ai-video-generators-2026',
    },
    {
      id: 'deal-shopper',
      title: 'Seasonal deal shoppers',
      subtitle: 'Prime Day and holiday carts',
      scenario:
        'Your cart is filling during Prime Day or a holiday sale. You want to know which trending deals are real value — not impulse traps.',
      searches: ['amazon prime day deals worth it 2026', 'best prime day kitchen deals'],
      pain: 'Everything looks like a “limited deal”. Hard to tell markdown from marketing.',
      weDeliver: [
        'Short lists tied to real seasonal demand',
        'Deal math with our savings calculator',
        'Skip picks that are hype-only at sale prices',
      ],
      exploreLabel: 'See seasonal briefs',
      exploreHref: '/trends/amazon-prime-day-deals-worth-it-2026',
    },
    {
      id: 'niche-buyer',
      title: 'Niche early buyers',
      subtitle: 'New gear, first accessories',
      scenario:
        'You just got a Switch 2 or started pickleball. You want a sane first-buy list — not ten accessories on day one.',
      searches: ['switch 2 accessories first buy', 'best pickleball paddle beginner'],
      pain: 'Launch hype pushes bundles you do not need. Forums disagree on everything.',
      weDeliver: [
        'First-buy priorities with pros and cons',
        'What to skip on day one',
        'Free session tools when they help',
      ],
      exploreLabel: 'Browse gaming & hobby briefs',
      exploreHref: '/trends/nintendo-switch-2-accessories',
    },
  ] satisfies Persona[],
  valuePillars: [
    {
      title: 'Structured briefs, not listicles',
      body: 'Every guide follows the same decision frame: who it is for, who should skip, pitfalls, picks, and a clear verdict.',
    },
    {
      title: 'Skip lists build trust',
      body: 'We earn nothing when you skip. Telling you not to buy is part of the product — not fine print.',
    },
    {
      title: 'Updated when hype shifts',
      body: 'Prices, products, and trend cycles change. Briefs carry a last-researched date and get revised when the market moves.',
    },
    {
      title: 'Tools for the decision moment',
      body: 'Calculators for deal math, video sizes, and session timing — usable on their own, without reading a full guide first.',
    },
    {
      title: 'FAQs that follow search',
      body: 'Each brief answers the exact questions US shoppers type — updated when new queries show up in search data, not buried in comment threads.',
    },
  ],
};
