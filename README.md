# MasoomDev Website

Official developer website for **MasoomDev** — games, puzzles and everyday tools.

## Run locally (Windows, no Vercel required)

1. Download or clone this repository to your Windows PC.
2. Install Python 3 if it is not already installed (no Python packages are needed).
3. Double-click `START-LOCAL.bat`.
4. Open `http://localhost:3000` if your browser does not open automatically.
5. Edit and save website files; the local browser automatically refreshes after a change.
6. Press Ctrl+C in the terminal to stop the preview.

The local server binds to `127.0.0.1` only. It serves the existing static site, supports client-side routes, and disables caching for development. Local static pages work without internet; external APIs and remote assets still need connectivity. Local testing does not consume Vercel deployments. Pushing commits to the production-connected branch may still trigger an automatic Vercel deployment, depending on Vercel settings.

## Deploy to Vercel

1. In Vercel choose **Add New → Project**.
2. Import GitHub repository `airtronunitedkingdom-byte/masoomdev-website`.
3. Framework preset: **Other**. Root directory: repository root. No build command is needed.
4. Deploy. `vercel.json` handles client-side routes.

## Add published apps

Edit the `APPS` array near the end of `index.html`. Each app can have `slug`, `name`, `category`, `icon`, `description`, `playUrl`, and a `privacy` object. Review the actual released app and all SDKs before publishing its privacy policy. Do not copy the sample values without verifying them.

App URL: `/apps/your-slug` and privacy policy URL: `/apps/your-slug/privacy`.

## Important

The website is currently configured with no published apps; sample apps are not shown as real releases. General website privacy text is not a substitute for app-specific disclosures. Verify hosting logs, advertising, analytics, SDK data collection and Google Play Data safety answers before publication.

Support: airtron68@gmail.com
