# Capital OS Beta Download Site

Static, privacy-respecting download page for Capital OS Beta. It has no accounts,
forms, or financial-data collection. Optional Google Analytics 4 is loaded only
after a visitor explicitly accepts analytics cookies.

## Local preview

From this folder, run:

```powershell
py -3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

The page calls the public GitHub Releases API for `hesouam999-source/capital-os-updates` and selects the Windows asset ending in `-setup.exe`. If the API is unavailable, it offers the official Releases page instead.

## GitHub Pages

The included workflow deploys the `main` branch through **GitHub Actions**. In
the repository's **Settings → Pages**, choose **GitHub Actions** as the source.
The workflow publishes only this static site. It optionally reads the GitHub
Actions repository variable `GA4_MEASUREMENT_ID` and writes a deployment-only
`analytics-config.js`; no Measurement ID is committed to source. Leave the
variable unset to keep analytics disabled.

No changes are required in the private `capital-os` application repository or the `capital-os-updates` repository.

## Google Analytics 4

1. In [Google Analytics](https://analytics.google.com/), create a **Web** data
   stream for `https://mycapitalos.com` and copy its Measurement ID (format
   `G-...`). Do not create a secret or API key for this site.
2. In `hesouam999-source/capital-os-website`, open **Settings → Secrets and
   variables → Actions → Variables** and create or update
   `GA4_MEASUREMENT_ID` with that ID.
3. Deploy the existing Pages workflow. The ID is injected into the published
   artifact only. The source `analytics-config.js` deliberately remains empty.
4. Visit the site, choose **Accept analytics**, then use GA4 **DebugView** to
   confirm one page view and the `download_windows` event after clicking either
   Windows download button.

Analytics is never initialized before consent, is not sent financial data or
SQLite contents, and tracks only the public release version plus the button
placement for a download click.

## Google Search Console

The public site exposes a canonical URL, `robots.txt`, and `sitemap.xml` at
`https://mycapitalos.com/`.

Prefer a **Domain property** verified through Cloudflare DNS: it covers both
`mycapitalos.com` and `www.mycapitalos.com` and does not add a verification
token to site source. In Google Search Console, choose **Add property → Domain**,
enter `mycapitalos.com`, copy Google's TXT record, add it in Cloudflare DNS as
**DNS only**, then click **Verify**. After verification, submit
`https://mycapitalos.com/sitemap.xml` under **Sitemaps**, use **URL inspection**
on `https://mycapitalos.com/`, and request indexing.

No Search Console verification token is stored in this repository. If DNS access
is unavailable, use Google's generated HTML verification file instead; add only
that exact file after it is generated and deploy it with the site.
