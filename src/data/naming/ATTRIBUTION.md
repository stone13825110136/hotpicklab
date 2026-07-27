# Naming Lab data attribution

Built by `npm run build-naming-data` from open sources listed in `docs/DATA-SOURCES.md`.

## Pet names

| Package / dataset | License | Role |
|-------------------|---------|------|
| [sindresorhus/dog-names](https://github.com/sindresorhus/dog-names) (`dog-names` npm) | MIT | Dog name seed (male/female lists) |
| [sindresorhus/cat-names](https://github.com/sindresorhus/cat-names) (`cat-names` npm) | MIT | Cat name seed |
| [NYC Dog Licensing Dataset](https://data.cityofnewyork.us/Health/NYC-Dog-Licensing-Dataset/nu7n-tubp) | NYC Open Data | Frequency / gender; expand to ~1000; breed×name affinity (in-pool only) |
| Letter coverage + pool supplement | Curated in build scripts | Ensure ~1000 names and A–Z / breed filters always associate |
| Breed affinity (heuristic, NYC when available) | Open / curated | Only names that exist in the species pool |

## Fortune Draw

| Package / dataset | License | Role |
|-------------------|---------|------|
| [tarotoo-tarot](https://www.npmjs.com/package/tarotoo-tarot) / [Tarotoo tarot dataset](https://github.com/Tarotoo-com/tarotoo-tarot-dataset) | MIT | 78 Rider–Waite–Smith meanings |

Card text adapted into short “naming vibe” lines for entertainment only — Fun reading · Not a prediction.

Dataset homepage: https://tarotoo.com/open-data
