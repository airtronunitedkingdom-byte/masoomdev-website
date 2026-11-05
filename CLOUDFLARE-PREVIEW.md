# Cloudflare Pages parallel preview (production-safe)

This branch is for **Cloudflare preview testing only**. Do not merge it into `main` until reviewed.

## Create a separate Cloudflare Pages project
1. In Cloudflare Dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Select `airtronunitedkingdom-byte/masoomdev-website`.
3. Use a **new** project name such as `masoomdev-preview` (do not attach any production custom domain).
4. Set **Production branch** to `cloudflare-preview`, NOT `main`.
5. Framework preset: **None**.
6. Build command: `python3 scripts/build-cloudflare-preview.py`.
7. Build output directory: `dist`.
8. Deploy and test the generated `*.pages.dev` URL.

Cloudflare's *production branch* here refers only to the separate Cloudflare preview project. It does **not** modify Vercel production.

## Validation checklist
- Home, Apps, Tools, Games and Extensions routes and assets load.
- PWA install/offline behavior and service worker scope work on the new origin.
- Theme, navigation, responsive layout and robot interactions work.
- ZIP downloads point to GitHub; no broken paths.
- Supabase / OAuth integrations: validate allowed origins and redirects before expecting login to work on `pages.dev`. Do not change shared authentication settings without reviewing effects on MasoomDev Videos and eBay Automator.
- Review hard-coded Vercel canonical URLs, sitemap and links before any domain migration. These are intentionally left unchanged in this preview.

## Safety
- No DNS, custom-domain, Supabase, or Vercel configuration changes.
- No changes to `main` and no Vercel production deployment requested.
- Do not use this preview branch for production cutover.
