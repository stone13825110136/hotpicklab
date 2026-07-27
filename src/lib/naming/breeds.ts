import type { Species, Vibe } from './types';
import affinityJson from '../../data/naming/breed-name-affinity.json';

/**
 * Popular-breed profiles for Pet Name Lab.
 * Dog boost lists prefer NYC open-data affinity (breed-name-affinity.json) when present.
 * Cat boost lists remain heuristic until an open cat×name dataset exists (R5).
 * Letter = soft preference (fills when thin); breed = soft reorder only (does not change practical / Hot Pick).
 */
export type BreedProfile = {
  id: string;
  label: string;
  species: Species;
  preferredVibes: Vibe[];
  preferShort?: boolean;
  /** Fallback / heuristic seeds when NYC rows are thin */
  boostNames: string[];
  /** Where boostNames primarily came from after resolve */
  affinitySource?: 'nyc-dog-licensing' | 'heuristic';
};

type AffinityFile = {
  source?: string;
  breeds?: Record<string, { topNames?: { name: string; count: number }[] }>;
};

const affinity = affinityJson as AffinityFile;

export const POPULAR_BREEDS: BreedProfile[] = [
  {
    id: 'labrador',
    label: 'Labrador Retriever',
    species: 'dog',
    preferredVibes: ['classic', 'cute'],
    preferShort: true,
    boostNames: ['Buddy', 'Bailey', 'Max', 'Charlie', 'Cooper', 'Daisy', 'Bella', 'Lucy', 'Molly', 'Duke'],
  },
  {
    id: 'golden-retriever',
    label: 'Golden Retriever',
    species: 'dog',
    preferredVibes: ['classic', 'cute'],
    preferShort: true,
    boostNames: ['Bailey', 'Charlie', 'Buddy', 'Daisy', 'Molly', 'Scout', 'Maggie', 'Cooper'],
  },
  {
    id: 'french-bulldog',
    label: 'French Bulldog',
    species: 'dog',
    preferredVibes: ['cute', 'unique'],
    preferShort: true,
    boostNames: ['Winston', 'Frenchie', 'Lola', 'Milo', 'Mochi', 'Gus', 'Bruno', 'Ollie'],
  },
  {
    id: 'german-shepherd',
    label: 'German Shepherd',
    species: 'dog',
    preferredVibes: ['strong', 'classic'],
    preferShort: true,
    boostNames: ['Rex', 'Duke', 'Shadow', 'Zeus', 'Bear', 'Rocky', 'Max', 'Luna'],
  },
  {
    id: 'poodle',
    label: 'Poodle',
    species: 'dog',
    preferredVibes: ['cute', 'classic'],
    preferShort: true,
    boostNames: ['Coco', 'Teddy', 'Toby', 'Milo', 'Bella', 'Charlie', 'Ruby', 'Daisy'],
  },
  {
    id: 'beagle',
    label: 'Beagle',
    species: 'dog',
    preferredVibes: ['cute', 'classic'],
    preferShort: true,
    boostNames: ['Snoopy', 'Bailey', 'Buddy', 'Daisy', 'Penny', 'Milo', 'Charlie', 'Molly'],
  },
  {
    id: 'bulldog',
    label: 'Bulldog',
    species: 'dog',
    preferredVibes: ['classic', 'strong'],
    preferShort: true,
    boostNames: ['Tank', 'Bruno', 'Diesel', 'Rocky', 'Gus', 'Rosie', 'Max', 'Rocco'],
  },
  {
    id: 'yorkshire-terrier',
    label: 'Yorkshire Terrier',
    species: 'dog',
    preferredVibes: ['cute', 'classic'],
    preferShort: true,
    boostNames: ['Bella', 'Coco', 'Teddy', 'Princess', 'Milo', 'Chloe', 'Max', 'Benji'],
  },
  {
    id: 'husky',
    label: 'Siberian Husky',
    species: 'dog',
    preferredVibes: ['strong', 'unique'],
    preferShort: true,
    boostNames: ['Luna', 'Blue', 'Shadow', 'Ghost', 'Zeus', 'Loki', 'Storm', 'Sky'],
  },
  {
    id: 'corgi',
    label: 'Corgi',
    species: 'dog',
    preferredVibes: ['cute', 'unique'],
    preferShort: true,
    boostNames: ['Winston', 'Archie', 'Pepper', 'Oliver', 'Millie', 'Charlie', 'Gizmo', 'Watson'],
  },
  {
    id: 'shih-tzu',
    label: 'Shih Tzu',
    species: 'dog',
    preferredVibes: ['cute', 'classic'],
    preferShort: true,
    boostNames: ['Bella', 'Oreo', 'Coco', 'Teddy', 'Gizmo', 'Princess', 'Cookie', 'Milo'],
  },
  {
    id: 'dachshund',
    label: 'Dachshund',
    species: 'dog',
    preferredVibes: ['cute', 'classic'],
    preferShort: true,
    boostNames: ['Lucy', 'Frankie', 'Oscar', 'Penny', 'Otto', 'Doxie', 'Milo', 'Daisy'],
  },
  {
    id: 'pomeranian',
    label: 'Pomeranian',
    species: 'dog',
    preferredVibes: ['cute', 'unique'],
    preferShort: true,
    boostNames: ['Coco', 'Teddy', 'Foxy', 'Mochi', 'Princess', 'Leo', 'Simba', 'Buddy'],
  },
  // Cats — heuristic until open cat×name licensing data exists
  {
    id: 'persian',
    label: 'Persian',
    species: 'cat',
    preferredVibes: ['classic', 'cute'],
    preferShort: true,
    boostNames: ['Princess', 'Fluffy', 'Coco', 'Pearl', 'Misty', 'Simba', 'Chloe', 'Luna', 'Oliver', 'Bella'],
  },
  {
    id: 'siamese',
    label: 'Siamese',
    species: 'cat',
    preferredVibes: ['unique', 'classic'],
    preferShort: true,
    boostNames: ['Ming', 'Lotus', 'Jade', 'Shadow', 'Cleo', 'Oscar', 'Luna', 'Milo', 'Nala', 'Simba'],
  },
  {
    id: 'maine-coon',
    label: 'Maine Coon',
    species: 'cat',
    preferredVibes: ['strong', 'classic'],
    preferShort: false,
    boostNames: ['Thor', 'Odin', 'Maple', 'Forest', 'Bear', 'Luna', 'Athena', 'Simba', 'Oliver', 'Shadow'],
  },
  {
    id: 'ragdoll',
    label: 'Ragdoll',
    species: 'cat',
    preferredVibes: ['cute', 'classic'],
    preferShort: true,
    boostNames: ['Cloud', 'Cotton', 'Angel', 'Mochi', 'Luna', 'Milo', 'Bella', 'Coco', 'Pearl', 'Oliver'],
  },
  {
    id: 'british-shorthair',
    label: 'British Shorthair',
    species: 'cat',
    preferredVibes: ['classic', 'cute'],
    preferShort: true,
    boostNames: ['Winston', 'Arthur', 'Blue', 'Smokey', 'Oliver', 'Bella', 'Charlie', 'Lucy', 'Max', 'Queenie'],
  },
  {
    id: 'bengal',
    label: 'Bengal',
    species: 'cat',
    preferredVibes: ['unique', 'strong'],
    preferShort: true,
    boostNames: ['Tiger', 'Leo', 'Zara', 'Blitz', 'Nala', 'Simba', 'Shadow', 'Jinx', 'Karma', 'Nova'],
  },
  {
    id: 'scottish-fold',
    label: 'Scottish Fold',
    species: 'cat',
    preferredVibes: ['cute', 'unique'],
    preferShort: true,
    boostNames: ['Bean', 'Button', 'Pip', 'Olive', 'Milo', 'Luna', 'Mochi', 'Coco', 'Teddy', 'Biscuit'],
  },
  {
    id: 'sphynx',
    label: 'Sphynx',
    species: 'cat',
    preferredVibes: ['unique', 'strong'],
    preferShort: true,
    boostNames: ['Ziggy', 'Jinx', 'Nova', 'Echo', 'Pixel', 'Cosmo', 'Velvet', 'Luna', 'Milo', 'Onyx'],
  },
];

export function breedsForSpecies(species: Species): BreedProfile[] {
  return POPULAR_BREEDS.filter((b) => b.species === species);
}

export function getBreedProfile(breedId: string | undefined | null): BreedProfile | undefined {
  if (!breedId) return undefined;
  const base = POPULAR_BREEDS.find((b) => b.id === breedId);
  if (!base) return undefined;

  const nycTop = affinity.breeds?.[breedId]?.topNames?.map((row) => row.name) ?? [];
  if (nycTop.length) {
    // Affinity file is pruned to in-pool names at build time (dogs + cats)
    return {
      ...base,
      boostNames: [...new Set([...nycTop, ...base.boostNames])],
      affinitySource: base.species === 'dog' && affinity.source?.includes('NYC')
        ? 'nyc-dog-licensing'
        : 'heuristic',
    };
  }

  return { ...base, affinitySource: 'heuristic' };
}

/** Soft affinity score 0–100 for ranking only (does not change practical / Hot Pick). */
export function breedAffinityScore(
  name: string,
  vibes: Vibe[],
  profile: BreedProfile | undefined,
): { score: number; fit: boolean } {
  if (!profile) return { score: 0, fit: false };

  const boostSet = new Set(profile.boostNames.map((n) => n.toLowerCase()));
  const inBoost = boostSet.has(name.toLowerCase());
  const vibeHit = profile.preferredVibes.some((v) => vibes.includes(v));
  const shortHit = profile.preferShort ? name.length >= 2 && name.length <= 6 : false;

  let score = 0;
  if (inBoost) score += 55;
  if (vibeHit) score += 30;
  if (shortHit) score += 15;

  return { score: Math.min(100, score), fit: inBoost || (vibeHit && shortHit) };
}

export function matchesLetter(name: string, letter: string | undefined | null): boolean {
  if (!letter) return true;
  const ch = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(ch)) return true;
  return name.trim().charAt(0).toUpperCase() === ch;
}
