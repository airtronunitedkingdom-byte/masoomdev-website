# MasoomDev ad placements (disabled by default)

The three reusable placements are on the homepage, tools directory/workspace page, and games directory/workspace page. They appear before the footer, away from game controls and download buttons.

Configuration: `/assets/adsense-config.js`. Set `publisherId` to the real `ca-pub-XXXXXXXXXXXXXXXX`, set the corresponding 10-digit AdSense ad unit slot IDs, and set `enabled: true` **only after** approval and the required privacy/consent setup. The loader intentionally does nothing until all required fields for a placement are valid. Never publish fake IDs.

The runtime script is `/assets/adsense-loader.js`. Each HTML page has a `data-md-ad-slot` container with `hidden` by default. There are no visible empty ad boxes and no Google advertising requests while disabled.

The website may be accessed through both the custom and Vercel domains, but the custom domain is canonical. Confirm domain authorization, AdSense site status, policy compliance, and consent requirements before enabling. Add `ads.txt` only with Google's exact real account information. Avoid ads in gameplay or near interactive buttons.

No ads are active in this branch. Production main is unchanged.
