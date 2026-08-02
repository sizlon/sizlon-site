# AGENTS.md

Guidance for anyone (human or agent) working on this repo. Aliased as `CLAUDE.md`.

## What this is

The public Sizlon marketing site: a **static** Astro site, **bilingual**
(English default + Korean), deployed to GitHub Pages at
[sizlon.io](https://sizlon.io). No SSR, no database — output is plain HTML/CSS
with a little inline JS. See `README.md` for the file-tree overview.

## Dev / build / verify

```
npm run dev      # local dev server at localhost:4322 (sizlon.localhost via the dev harness Caddy;
                 # 4322 so it can run alongside miriboa-site's 4321)
npm run build    # static build to ./dist/  (65 routes today, incl. redirect stubs)
npm run preview  # serve the built ./dist/ locally
```

When starting the dev server here, use background mode: `astro dev --background`,
and manage it with `astro dev stop` / `status` / `logs`.

**Verify changes with `npm run build`** and inspect the emitted files under
`dist/` (e.g. `dist/contact/index.html`). The build is the source of truth for
what ships — grep the output to confirm a change rendered on both the en page
and its `dist/ko/...` counterpart.

## Content & i18n — the core convention

**All copy lives in `src/i18n/content.ts`, keyed by locale (`en`, `ko`).** Markup
stays language-free: pages and sections read `content[lang]` via `t(lang)` from
`src/i18n/utils.ts`. When you add or change a user-facing string:

- Add it to **both** `en` and `ko`. A missing key breaks the typed `as const`
  content object.
- Keep product/proper nouns (Crawler Platform, Miriboa, Postgres, …) in English
  in both locales.
- Routing: en at the root, ko under `/ko`. Every page has an en and a ko variant.
  Use `localizePath` / `logicalPath` (utils) for locale-aware hrefs.

## Structure & where things go

- `src/config/site.ts` — the single config/coupling point: `nav`, `crawlerPages`,
  the product list (`solutions[]`), and the contact-form/Turnstile keys.
- `src/pages/**` — thin route files that just render a section (en at root, ko
  mirror under `src/pages/ko/**`).
- `src/sections/**` — the actual page bodies.
- `src/components/**` — shared chrome (`Nav`, `Footer`, `SolutionCard`, …).
- `src/layouts/Base.astro` — the html shell + `<head>` meta.

**Adding a page:** create a section, then thin en + ko page files that render it;
wire nav/product entries in `site.ts` and copy in `content.ts` (both locales).

## Products & navigation

The company umbrella is *AI proposes, a deterministic layer verifies* — product-
neutral. Products live in `solutions[]` (Crawler Platform, Miriboa). Crawler-
specific pages (How it works, Security, Editions) are **scoped under Crawler
Platform** (`crawlerPages`), not in the global nav. Keep that split when adding
product-specific pages.

**This is the company site, not a product site.** Miriboa was split out to
miriboa.sizlon.io (2026-07-23); that repo (`miriboa-site`) owns the service copy,
prices, and the service's own legal docs. Here Miriboa gets exactly one thin
gateway page (`/bid-verification`, `MiriboaGateway.astro`) whose cards link out.
**Do not restate Miriboa prices, credit rules, or SLA on this site** — the
2026-07-29 audit found the company site advertising a paid tier for a feature
that had become free, because the copy was duplicated here and drifted. Legal
pages follow the same rule: sizlon.io's terms/privacy cover this site only and
point at the Miriboa docs for the service.

`/about` is the company page (legal entity, principles, contact). Product
narratives belong on the product pages, not there.

## Contact form

The contact form fetch-POSTs to the site backend at `svc.sizlon.io/api/contact`
(source: **sizlon-platform repo, `site-backend/`** — runs in the portal-stack
compose on the vendor host). It verifies Cloudflare Turnstile server-side,
stores submissions, and emails hello@sizlon.io. This repo owns only the form UI
(`src/sections/Contact.astro`) and the endpoint/site-key in `src/config/site.ts`;
backend changes happen in sizlon-platform. (The previous Google Apps Script
backend was retired 2026-07-18.)

## Gotchas

- **Scoped styles vs `[hidden]`:** Astro-scoped CSS beats the UA
  `[hidden]{display:none}` rule, so an element that has both a `display` rule and
  the `hidden` attribute stays visible. Add a scoped
  `[hidden]{display:none!important}` when you toggle visibility via the attribute.
- **External scripts:** use `<script is:inline src="…">` so Astro leaves a CDN
  script untouched (e.g. the Turnstile api.js). There is no CSP on the site.
- **New UI strings must be bilingual** — the `as const` content object fails the
  build if a locale is missing a key.
- **noindex and the sitemap move together:** a page excluded by
  `SITEMAP_EXCLUDE` in `astro.config.mjs` must also carry `noindex` (the `Base`
  prop, or a literal meta tag in the hand-written redirect stubs), and vice versa.
- **`public/robots.txt` must exist.** Without an origin robots.txt, Cloudflare
  serves a *managed* one that blocks GPTBot/ClaudeBot/Google-Extended and omits
  the Sitemap line — that was the live state until 2026-07-29.
- **`content.ts` holds only live copy.** The blocks left over from the split-off
  app pages (`monitor`, `verifyCredits`, `verifyRequest`, `verifyManage`,
  `solutions`, `connector`, `miriboa`, `precheck`) were deleted 2026-07-29 along
  with their sections. Both locales must keep the *same* key set — if you add a
  key to one, add it to the other or the `as const` object fails the build.

## Deploy

`deploy.yml` builds and publishes to GitHub Pages on every **push to `main`**
(and manual dispatch). There is no separate release step — merging to `main`
ships the site. (This is a standalone repo; the sizlon-platform monorepo's
manual-CI constraints do not apply here.)

## Astro reference

Full docs: https://docs.astro.build — most relevant here:

- [Routing / pages](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
