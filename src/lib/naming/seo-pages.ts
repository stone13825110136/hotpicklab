import seoSlugs from '../../data/naming/seo-slugs.json';
import type { Gender, Species, Vibe } from './types';

export type SeoFaq = { question: string; answer: string };

export type NamingSeoPage = {
  slug: string;
  species: Species;
  gender: Gender;
  vibe: Vibe;
  /** Primary search phrase, e.g. "cute dog names" */
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  tip: string;
  keywords: string[];
  faqs: SeoFaq[];
};

type Spec = {
  slug: string;
  gender: Gender;
  vibe: Vibe;
  /** Phrase before "dog/cat names", e.g. "cute", "cute boy" */
  label: string;
};

/** Keep in sync with src/data/naming/seo-slugs.json (IndexNow reads that file). */
const SPEC_BY_SLUG: Record<string, Omit<Spec, 'slug'>> = {
  cute: { gender: 'neutral', vibe: 'cute', label: 'cute' },
  strong: { gender: 'neutral', vibe: 'strong', label: 'strong' },
  unique: { gender: 'neutral', vibe: 'unique', label: 'unique' },
  classic: { gender: 'neutral', vibe: 'classic', label: 'classic' },
  boy: { gender: 'boy', vibe: 'classic', label: 'boy' },
  girl: { gender: 'girl', vibe: 'classic', label: 'girl' },
  'cute-boy': { gender: 'boy', vibe: 'cute', label: 'cute boy' },
  'cute-girl': { gender: 'girl', vibe: 'cute', label: 'cute girl' },
  'strong-boy': { gender: 'boy', vibe: 'strong', label: 'strong boy' },
  'strong-girl': { gender: 'girl', vibe: 'strong', label: 'strong girl' },
  'unique-boy': { gender: 'boy', vibe: 'unique', label: 'unique boy' },
  'unique-girl': { gender: 'girl', vibe: 'unique', label: 'unique girl' },
};

const SPECS: Spec[] = (seoSlugs as string[]).map((slug) => {
  const base = SPEC_BY_SLUG[slug];
  if (!base) throw new Error(`Missing SEO spec for slug: ${slug}`);
  return { slug, ...base };
});

function titleCase(label: string): string {
  return label
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildFaqs(species: Species, keyword: string, vibe: Vibe, gender: Gender): SeoFaq[] {
  const pet = species === 'dog' ? 'dog' : 'cat';
  const pets = species === 'dog' ? 'dogs' : 'cats';
  const genderBit =
    gender === 'boy' ? ' for boys' : gender === 'girl' ? ' for girls' : '';

  return [
    {
      question: `What are good ${keyword}?`,
      answer: `Good ${keyword} are short enough to call across a yard or apartment, easy to pronounce, and fit the vibe you want${genderBit}. Use practical scores in our lab to shortlist names that are easy to use every day — then compare 2–5 favorites and pick one Hot Pick.`,
    },
    {
      question: `How do I choose between similar ${pet} names?`,
      answer: `Put 2–5 finalists into Compare. Hot Pick uses practical score (call ease, popularity fit, and vibe match) — not a fortune reading. Optional fun vibe cards are entertainment only and do not change the winner.`,
    },
    {
      question: `Are these ${keyword} ranked by popularity?`,
      answer: `Popularity is one part of the score, blended with how easy the name is to call and how well it matches the ${vibe} vibe. That keeps classic hits visible while still surfacing strong everyday options for ${pets}.`,
    },
  ];
}

function buildPage(species: Species, spec: Spec): NamingSeoPage {
  const pet = species === 'dog' ? 'dog' : 'cat';
  const pets = species === 'dog' ? 'dogs' : 'cats';
  const keyword = `${spec.label} ${pet} names`;
  const heading = `${titleCase(spec.label)} ${titleCase(pet)} Names`;
  const genderPhrase =
    spec.gender === 'boy' ? 'boy' : spec.gender === 'girl' ? 'girl' : 'any gender';

  return {
    slug: spec.slug,
    species,
    gender: spec.gender,
    vibe: spec.vibe,
    keyword,
    title: `${heading} — Compare & Hot Pick`,
    description: `Browse ${keyword} with practical scores. Filter by ${genderPhrase} and ${spec.vibe} vibe, compare favorites, and get one Hot Pick — free, no sign-up.`,
    h1: heading,
    intro: `Looking for ${keyword}? Start with a scored shortlist built for real life — names that are easy to call, fit a ${spec.vibe} vibe, and work for ${genderPhrase === 'any gender' ? pets : `${genderPhrase} ${pets}`}. Then compare a few favorites and land on one Hot Pick.`,
    tip: `Tip: pick 2–5 names you can say out loud without stumbling. Hot Pick is based on practical score, not a prediction. Fun vibe cards are optional entertainment only.`,
    keywords: [
      keyword,
      `${pet} names`,
      `${spec.vibe} ${pet} names`,
      `best ${keyword}`,
      'pet name generator',
      'hot pick',
    ],
    faqs: buildFaqs(species, keyword, spec.vibe, spec.gender),
  };
}

export const DOG_SEO_PAGES: NamingSeoPage[] = SPECS.map((s) => buildPage('dog', s));
export const CAT_SEO_PAGES: NamingSeoPage[] = SPECS.map((s) => buildPage('cat', s));

export function getSeoPages(species: Species): NamingSeoPage[] {
  return species === 'dog' ? DOG_SEO_PAGES : CAT_SEO_PAGES;
}

export function getSeoPage(species: Species, slug: string): NamingSeoPage | undefined {
  return getSeoPages(species).find((p) => p.slug === slug);
}

export function seoPath(page: NamingSeoPage): string {
  return `/${page.species}-names/${page.slug}`;
}

export function hubPath(species: Species): string {
  return `/${species}-names`;
}

/** All long-tail + hub paths for sitemap / IndexNow */
export function allNamingSeoPaths(): string[] {
  return [
    '/dog-names',
    '/cat-names',
    ...DOG_SEO_PAGES.map(seoPath),
    ...CAT_SEO_PAGES.map(seoPath),
  ];
}
