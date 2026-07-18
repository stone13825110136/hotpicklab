# HotPick Lab

Domain: **hotpicklab.com** · Repo: **stone13825110136/hotpicklab**

Pain-point research for builders who can ship code but don’t want to ship blind. Thin landing + email-delivered report ($49). Old Amazon / “worth it” briefs are retired; legacy URLs redirect home.

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
