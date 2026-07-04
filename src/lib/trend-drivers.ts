/** Shopper-facing labels for trend driver tags (see docs/TREND_SYSTEM_FRAMEWORK.md). */
export const TREND_DRIVER_LABELS: Record<string, string> = {
  'social-proof': 'Lots of people posting it',
  'demo-moment': 'Easy to see why it works in a video',
  'low-regret-price': 'Low risk to try',
  'identity-fit': 'Matches a lifestyle aesthetic',
  seasonal: 'Timing (heat, holidays, sales)',
  'platform-halo': 'TikTok discovery → Amazon purchase',
  'launch-cycle': 'New product or launch wave',
};

export type VerdictAction = 'buy' | 'skip' | 'wait';

export const VERDICT_LABELS: Record<VerdictAction, string> = {
  buy: 'Buy',
  skip: 'Skip',
  wait: 'Wait',
};

export type TrendVsTruthRow = {
  trendSays: string;
  fullPicture: string;
};

export type TrendVerdict = {
  action: VerdictAction;
  summary: string;
  bestFor: string;
  skipIf: string;
  whyFeelGood?: string;
};

export type TrendProof = {
  trendDrivers?: string[];
  signalNotes?: string;
  trendVsTruth?: {
    intro?: string;
    rows: TrendVsTruthRow[];
  };
  verdict?: TrendVerdict;
};

export function driverLabel(key: string): string {
  return TREND_DRIVER_LABELS[key] ?? key;
}
