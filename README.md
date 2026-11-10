# MasoomDev Website

Official MasoomDev website: https://masoomdev.online/

## Branch workflow

- `main`: production branch used for Cloudflare deployment. Do not push untested changes here.
- `local-testing`: development, preview and validation. Merge into `main` only after testing.

## Website sections

- Home (`/`): product discovery, featured apps, games, tools and Masoom Buddy.
- Apps (`/apps/`): Android and Windows app pages, downloads and app-specific privacy/terms.
- Tools (`/tools/`): calculators, text/developer tools, image tools and PDF/file utilities.
- Games (`/games/`): browser games, mini-games and individual game pages.
- Extensions (`/extensions/`): Chrome extension listings and GitHub ZIP downloads.
- Blog (`/blog/`): technology tutorials and tool guides.
- SEO Tools (`/seo-tools/`): metadata, keyword, robots and sitemap helpers.
- Admin (`/admin/`): GitHub OAuth-based blog management.
- Legal/support: `/privacy/`, `/terms/`, `/support/`, `/data-deletion/`.

## Run locally (Windows)

1. Clone/download the repository and check out `local-testing`.
2. Install Python 3.
3. Run `START-LOCAL.bat`.
4. Open http://localhost:3000 if the browser does not open automatically.
5. Edit files and test in the browser. Stop the server with Ctrl+C.

The preview binds to `127.0.0.1`. Local HTML tools and cached resources can work offline; remote dependencies still require internet.

## Cloudflare production deployment

This project uses Cloudflare Workers with static assets, not just Cloudflare Pages. Refer to `ADMIN-SETUP.md` for Worker deployment, GitHub OAuth configuration and required secrets.

Build static assets:

```bash
python scripts/build-cloudflare-preview.py
```

Deploy (only after tests and approval):

```bash
npx wrangler deploy
```

`wrangler.jsonc` configures `src/worker.js`, which routes `/api/admin/*` to the admin API and other requests to static assets. Check the target Worker and production branch before deploying.

## Validation

Run `node scripts/md2-smoke-test.mjs` for the available static checks. These do not replace manual mobile, desktop, extension download, admin-login and deployment checks.

## Privacy and publication

App privacy policies must accurately reflect each app's actual permissions, SDKs and data practices. Verify advertising, analytics, download URLs and Google Play disclosures before publishing.

Support: airtron68@gmail.com
