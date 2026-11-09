# MasoomDev Studio (Cloudflare Workers with Static Assets)

This project is deployed with `npx wrangler deploy` as a Worker, not Cloudflare Pages. `src/worker.js` routes `/api/admin/*` to the existing admin API and serves the static website via the ASSETS binding. `wrangler.jsonc` configures the Worker and `dist` assets.

Cloudflare Worker **Production** variables/secrets (do not commit their values):
- GITHUB_CLIENT_ID — Variable
- GITHUB_CLIENT_SECRET — Secret
- ADMIN_GITHUB_ID — Variable, numeric GitHub user ID
- ADMIN_SESSION_SECRET — Secret, securely generated random value

GitHub OAuth callback: https://masoomdev.online/api/admin/callback

Build: `python scripts/build-cloudflare-preview.py`
Deploy: `npx wrangler deploy`

Cloudflare Production Branch remains `main`; the admin API publishes blog HTML to `main`. Verify Worker environment secrets after deployment and test /api/admin/me (should return HTTP 401 before login), /admin/, and OAuth sign-in before publishing.

This is a trusted-admin HTML editor, not a full WordPress CMS. OAuth uses the broad `repo` scope; consider a dedicated GitHub account with only the intended repository access.
