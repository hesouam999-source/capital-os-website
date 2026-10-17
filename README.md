# Capital OS Beta Download Site

Static, privacy-respecting download page for Capital OS Beta. It has no analytics, accounts, forms, or trackers.

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
The workflow requires no secrets and publishes only this static site.

No changes are required in the private `capital-os` application repository or the `capital-os-updates` repository.

## Google Search Console

The public site exposes a canonical URL, `robots.txt`, and `sitemap.xml` at `https://mycapitalos.com/`. To connect Google Search Console, add the URL-prefix property `https://mycapitalos.com/`, complete ownership verification in Google Search Console, then submit `https://mycapitalos.com/sitemap.xml` in **Sitemaps**. Use **URL Inspection** to test the live page and request indexing after material changes.

No Search Console verification token is stored in this repository. Add an ownership-specific verification tag or file only after it is generated for the owner's Search Console property.
