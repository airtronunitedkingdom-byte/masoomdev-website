# MasoomDev Website

Official developer website for **MasoomDev** — games, puzzles and everyday tools.

## Run locally

Static website: open `index.html` in a browser, or use any local static HTTP server.

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
