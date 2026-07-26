# HotPick Lab

Domain: **hotpicklab.com** · Repo: **stone13825110136/hotpicklab**

**Current product direction:** Naming selection lab (pet → people → business names) with entertainment Fortune Draw and Hot Pick. See:

- [docs/NAMING-LAB-PLAN.md](./docs/NAMING-LAB-PLAN.md) — product plan  
- [docs/DATA-SOURCES.md](./docs/DATA-SOURCES.md) — open data sources  
- [docs/OPERATING-RULES.md](./docs/OPERATING-RULES.md) — SEO / QA / what may go on-site  

Seller/creator utilities (compress, HEIC, marketplace image prep) live on **minitoolhq.com** only — not this repo.

Legacy: pain-point research landing / email report may still exist in code history; naming lab is the active roadmap.

## Local

```bash
npm install
npm run dev
```

## Deploy

Cloudflare Pages project `hotpicklab` (see `docs/PROJECT_HANDOFF.md` for account notes).

```bash
npm run build
npx wrangler pages deploy dist --project-name=hotpicklab --branch=main
```

Or push `main` if the Pages Git integration is connected.
