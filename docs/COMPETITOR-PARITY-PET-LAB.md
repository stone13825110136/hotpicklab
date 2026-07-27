# Pet Name Lab — Competitor parity (internal)

**Status:** active target  
**Date:** 2026-07-27  
**Rules:** OPERATING-RULES R1–R6, R5 data stack  

> Internal only — not a public page (R3).

## Parity means (vs NameJenny / PetZenAI / Rover-style tools)

We match **filter + selection usefulness**, not every gimmick.

| Capability | Competitors | HotPickLab target | Status |
|------------|-------------|-------------------|--------|
| Species dog/cat | Yes | Yes | Done |
| Gender | Yes | Yes | Done |
| Style / vibe | Yes | Cute/Strong/Unique/Classic | Done |
| **Starts with letter** | NameJenny / PetZen | A–Z hard filter | Done |
| **Breed filter** | Rover-style + lists | Popular breeds; dog affinity from NYC open data | Done |
| Ranked shortlist / score | Rare | Practical score | Done (ahead) |
| Compare → Hot Pick | Rare | Core differentiator | Done (ahead) |
| Fortune entertainment | Rare | Optional; not Hot Pick | Done |
| 40+ species / AI wait | NameJenny | **Out of scope** (dog/cat lab) | Skip |
| Name meaning essays | NameJenny | Later | Skip v1.1 |
| Shareable IG card | PetNameAI | Later | Skip v1.1 |

## Breed data (R5)

| Layer | Source | Role |
|-------|--------|------|
| Breed dropdown | Curated popular US breeds | UI labels / SEO-friendly ids |
| Dog name×breed affinity | **NYC Dog Licensing** open data | Top names per breed → soft reorder |
| Cat affinity | Heuristic until open cat×name exists | Soft only; disclose as heuristic |

**Forbidden:** AKC full scrape as product data.

## Product rules (do not break)

- Letter = **hard** filter  
- Breed = **soft** affinity (reorder / “breed fit” tag)  
- Practical score + Hot Pick **unchanged** by breed/tarot (R6)  
- Customer UI English only (R3)
