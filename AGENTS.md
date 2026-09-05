# AGENTS.md

Guidance for anyone (human or agent) working on this repo. Aliased as `CLAUDE.md`.

## What this is

The Sizlon company site: a **static** Astro site, **Korean-first** (Korean at the
root, one English page at `/en/`), deployed to GitHub Pages at
[sizlon.io](https://sizlon.io). No SSR, no database — output is plain HTML/CSS
with a little inline JS. See `README.md` for the file-tree overview.

**What it sells (since the 2026-09-05 restructure, plan v3 at
`~/Projects/docs/sizlon-site-restructure-plan-v3.md`):** three services done by
the founder — Korean search-quality diagnostics (`/services/search`), audit-
response requirements traceability (`/services/rtm`), and monthly data feeds
(`/services/data`). Miriboa is *evidence* (`/work`), not a product being sold
here; the crawler is a one-line tool mention on the data-feed page. The old
product pages (`/bid-verification`, `/web-crawling`, `/how-it-works`,
`/security`, `/editions`) are redirect stubs.

## Dev / build / verify

```
npm run build    # static build to ./dist/  (74 routes today, incl. redirect stubs)
npm run preview  # serve the built ./dist/ locally
```

**Dev server: don't start one here.** The dev harness (sizlon-dev-harness) runs
`astro dev` as a resident container (`site-dev-www`, port 4322) — open
https://sizlon.localhost (alias: www.localhost) and edits hot-reload on save.
Logs: `docker compose logs -f site-dev-www` (harness dir). After changing
dependencies (package-lock), `docker compose restart site-dev-www`. Running
`npm run dev` on the host is unnecessary and will port-bump.

**Verify changes with `npm run build`** and inspect the emitted files under
`dist/`. The build is the source of truth for what ships — grep the output.
`scripts/smoke-live.sh [base]` checks the live site: new pages 200, every old
URL 301 with the expected `Location` (those 301s come from Cloudflare, see
"URLs and redirects").

## Content — the core convention

**All copy lives in `src/i18n/content.ts`.** Markup stays language-free.

- **Page bodies are Korean-only and read `content.ko.*` directly** (Home,
  Service, Work, About, Contact, Legal). Do not add English twins of these
  pages — the English surface is exactly one page, `/en/` (`En.astro`, reading
  `content.en.page`), written for Upwork clients.
- **Chrome (Nav/Footer/Base) reads `t(lang)`** and needs the same key shape in
  both locales: `common`, `nav`, `footer`, `legalNav`, `notFound`. Add a chrome
  key to both or the typed `as const` object fails the build. Page keys exist in
  `ko` only.
- **Numbers and claims come from `content.ko.proof` and nowhere else** (plan v3
  §2). Career line (Mediabee: 7,000 sources · 200K articles/day), current work
  (KONEPS bid-opening data: 73,373 negotiated-contract bids over six months),
  engine benchmark (recall 87.4% · precision 96.5%). Never invent crawler
  volumes, customer counts, or savings — there are none to cite.
- **Forbidden words**: on `/services/search` — "AI", "LLM", "결정론적" (buyers'
  language only; the footer tagline is the one allowed exception). Site-wide —
  "크롤러 플랫폼", "에디션", "셀프호스팅/매니지드", "외주 없이" (the last one was
  removed 2026-08-06 because it reads as a ban on partners; say "대표가 직접 수행").
- **Never restate Miriboa prices, credit rules, or SLA here** — the 2026-07-29
  audit found this site advertising a paid tier that had become free because the
  copy was duplicated and drifted. Link to miriboa.sizlon.io instead.
- **RTM page ships in "brief" mode** (`content.ko.services.rtm.brief = true`)
  until two or three SI-PM calls confirm "감리 대응"/"RTM" is their vocabulary.
  The full blocks are already written; flip the flag.

## Structure & where things go

- `src/config/site.ts` — nav, `servicePages` (service → contact topic key),
  phone/email, `bookingUrl` (empty → CTAs fall back to `/contact#form`),
  `upworkUrl` (empty → hidden on `/en/`), contact endpoint + Turnstile key.
- `src/pages/**` — thin route files (Korean at root, `en/index.astro`, and the
  redirect stubs). `src/sections/**` — page bodies. `src/components/**` — Nav,
  Footer. `src/layouts/Base.astro` — html shell, `<head>`, JSON-LD.

**Adding a page:** section + one route file; copy in `content.ko`; nav entry in
`site.ts` if it belongs in the nav.

## URLs and redirects

- **GitHub Pages cannot 301.** Real redirects are **Cloudflare Single Redirects
  rules** on the sizlon.io zone (six rules, listed in plan v3 §1). The hand-written
  stubs in `src/pages/**` (`meta refresh` + JS + canonical) are only the fallback
  for when a rule is missing — keep them until `scripts/smoke-live.sh` shows the
  301s, then they can go.
- **Stubs carry `canonical` + sitemap exclusion, never `noindex`** (2026-08-08,
  GSC-verified): `noindex` plus a canonical pointing elsewhere is a conflicting
  signal and Google may apply the `noindex` to the *target*. `SITEMAP_EXCLUDE`
  in `astro.config.mjs` is the only thing keeping stubs out of the index —
  when you add a stub, add its path there.
- **Never use Astro's `redirects:` config** — it emits `noindex` on the generated
  page and you cannot turn it off (the conflict above).
- **No two-hop redirects.** `/ko/*` variants of old product URLs go straight to
  the final destination (rules 1–4 before rule 6; same in `src/pages/ko/[...slug]`).
- **hreflang** exists for one pair only, `/` ↔ `/en/` (Base.astro). The sitemap
  integration's `i18n` option is intentionally off — it would fabricate `/en/…`
  alternates for Korean-only pages.
- **Cloudflare caches static files for 4h.** After a deploy, purge the changed
  URLs (Caching → Purge Cache → Custom Purge) or verify with `?cb=$RANDOM`.

## Contact form

The form fetch-POSTs to the site backend at `svc.sizlon.io/api/contact`
(source: **sizlon-platform repo, `site-backend/`**). It verifies Cloudflare
Turnstile server-side, stores the submission, and emails hello@sizlon.io. The
backend requires `name`, `email`, `message`; `topic` is mapped through
`TOPIC_LABELS` there (keys here: `search`, `rtm`, `datafeed`, `other`). The form
prefixes the message with `[서비스] …` and `[전화] …` itself, so a topic is
never silently lost even if the backend table lags. Never remove keys from the
backend table — miriboa-site posts to the same endpoint.

## Phone

**Phone is a sales channel (rule reversed 2026-09-05, plan v3 §3.7).** Until
then 02-702-5795 was "business-registration display only": no `tel:` links, no
JSON-LD `telephone`, email-only support. Now: phone tops the hero and `/contact`,
`tel:` and JSON-LD `telephone` are on, staffed weekdays 09–18. Miriboa's site
keeps email-only. Do not "fix" a `tel:` link back out.

## Gotchas

- **Scoped styles vs `[hidden]`:** Astro-scoped CSS beats the UA
  `[hidden]{display:none}` rule; add a scoped `[hidden]{display:none!important}`
  when you toggle visibility via the attribute.
- **External scripts:** use `<script is:inline src="…">` so Astro leaves a CDN
  script untouched (e.g. the Turnstile api.js). There is no CSP on the site.
- **`getStaticPaths` is hoisted** — it cannot see other frontmatter constants.
  Put lookup tables inside it and pass results via `props`.
- **`public/robots.txt` must exist.** Without an origin robots.txt, Cloudflare
  serves a *managed* one that blocks GPTBot/ClaudeBot/Google-Extended and omits
  the Sitemap line — that was the live state until 2026-07-29.
- **404 is one file** (`dist/404.html`) for every path; it renders Korean and
  swaps to English client-side under `/en/`.

## Deploy

`deploy.yml` builds and publishes to GitHub Pages on every **push to `main`**
(and manual dispatch). There is no separate release step — merging to `main`
ships the site. After the v3 cut-over also: create the six Cloudflare rules,
purge cache, run `scripts/smoke-live.sh`, resubmit the sitemap in GSC (Domain
property) — and do not resubmit again while English URLs drop out; that is
expected.

## Astro reference

Full docs: https://docs.astro.build — most relevant here:

- [Routing / pages](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
