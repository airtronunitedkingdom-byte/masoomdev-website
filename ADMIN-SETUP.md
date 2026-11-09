# MasoomDev private admin setup (Cloudflare Pages)
This is a GitHub-backed blog HTML editor, not a complete WordPress CMS. The /admin/ URL is unlisted, not a security boundary. All API actions require a verified GitHub OAuth identity and an encrypted HttpOnly session.
1. In GitHub Developer Settings create an OAuth App with homepage https://masoomdev.online and callback https://masoomdev.online/api/admin/callback.
2. In Cloudflare Pages project Settings → Variables and Secrets, configure GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (secret), ADMIN_GITHUB_ID (numeric GitHub user ID; not username), ADMIN_SESSION_SECRET (random 32+ byte secret).
3. Ensure Cloudflare Pages builds with Functions enabled and deploys the main branch. Pages Functions must be discovered from the repository root functions/ directory. Do not expose OAuth secrets to the browser or commit them.
4. Visit /admin/ and sign in. OAuth scope repo grants broad repository access; use a dedicated account with only required repo access when possible. Restrict access to the intended GitHub account numeric ID.
5. Posts publish to main. Cloudflare Production Branch remains main. Verify live deployment and use Cloudflare Access as optional extra protection.
6. No visual WYSIWYG editor, media uploads, roles, drafts or global pages management yet. Changes are full HTML edits with GitHub commit history and SHA concurrency checks.
