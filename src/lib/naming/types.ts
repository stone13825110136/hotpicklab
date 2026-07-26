export type Species = 'dog' | 'cat';
export type Gender = 'boy' | 'girl' | 'neutral';
export type Vibe = 'cute' | 'strong' | 'unique' | 'classic';

export type NameEntry = {
  name: string;
  gender: Gender[];
  vibes: Vibe[];
  popularity: number;
  sources?: string[];
};

export type TarotCard = {
  id: number;
  name: string;
  vibe: string;
  arcana?: string;
  keywords?: string[];
  source?: string;
};

export type ScoredName = NameEntry & {
  practical: number;
  tags: string[];
  tarot?: TarotCard;
  reason?: string;
};
