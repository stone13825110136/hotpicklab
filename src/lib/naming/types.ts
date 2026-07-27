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

export type RankFilters = {
  /** A–Z preference; hard when enough matches, else soft-fill (letterStillPreferred) */
  letter?: string;
  /** Popular breed id; soft affinity only (does not change practical score) */
  breedId?: string;
};

export type RankResultMeta = {
  /** Exact letter matches before soft-fill */
  letterExactCount: number;
  /** True when we filled beyond exact letter matches */
  letterSoftened: boolean;
};

export type ScoredName = NameEntry & {
  practical: number;
  tags: string[];
  /** Soft breed affinity for ranking / tags only — not used for Hot Pick */
  breedFit?: boolean;
  breedAffinity?: number;
  /** Name matched the starts-with letter */
  letterMatch?: boolean;
  tarot?: TarotCard;
  reason?: string;
};
