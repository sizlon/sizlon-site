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
npm run build    # static build to ./dist/ (75 routes incl. redirect stubs) + internal-link check
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
  pages — the English surface is `/en/` (`En.astro`, reading
  `content.en.page`), written for Upwork clients, plus English **notes**
  (`/en/notes/<slug>/`, see below) — evidence articles are the one thing worth
  translating because the numbers are the same in both markets.
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
  Scope of the "크롤러 플랫폼" ban (clarified 2026-09-06): *selling it as a product*
  on any sales page. The name stays in the legal trademark line, and the legal
  pages describe the license model generically ("소프트웨어를 납품하는 경우") —
  the owner intends to productize Crawler Platform once data-feed engagements
  have repeated and stabilized; when that happens, revive `/products/crawler-platform/`
  (drop its stub and the `SITEMAP_EXCLUDE` entry) rather than minting a new URL.
- **When you change a page's copy, bump its date in `src/config/lastmod.ts`** in
  the same commit — that map feeds the sitemap `<lastmod>`. Hand-written on
  purpose: stamping the build time on every page at every deploy makes Google
  ignore lastmod entirely. Markup/design-only changes do not bump it. Legal pages
  must match the visible `content.ko.legal.updated`.
- **`<title>` stays short and dash-free** — Base.astro appends "— 시즐론", and a
  mobile SERP shows ~30 Korean characters, so a title that is itself "A — B"
  loses the brand. Titles and `h1`s are separate strings; a long h1 is fine.
- **Never restate Miriboa prices, credit rules, or SLA here** — the 2026-07-29
  audit found this site advertising a paid tier that had become free because the
  copy was duplicated and drifted. Link to miriboa.sizlon.io instead.
- **RTM page ships in "brief" mode** (`content.ko.services.rtm.brief = true`)
  until two or three SI-PM calls confirm "감리 대응"/"RTM" is their vocabulary.
  The full blocks are already written; flip the flag.

## Structure & where things go

- `src/config/site.ts` — nav, `servicePages` (service → contact topic key),
  phone/email, `bookingUrl` (empty → CTAs fall back to `/contact/#form`),
  `upworkUrl` (empty → hidden on `/en/`), contact endpoint + Turnstile key.
- `src/pages/**` — thin route files (Korean at root, `en/index.astro`, and the
  redirect stubs). `src/sections/**` — page bodies. `src/components/**` — Nav,
  Footer, RedirectStub. `src/layouts/Base.astro` — html shell, `<head>`, JSON-LD.
- **JSON-LD is one `@graph` per page** (Base.astro): the company node
  (`ProfessionalService`, `@id` = `ORG_ID` in site.ts) on every page, a
  `BreadcrumbList` on every non-home page, plus whatever a page passes through
  the `schema` prop — `/founder` passes `Person` + `ProfilePage` (`FOUNDER_ID`),
  the service pages pass `Service` + `Offer` whose numbers come from
  `content.ko.services.*.offer` (keep them equal to the displayed `price` line).
- **OG image is `public/og-v3.png`** (1200×630, Korean v3 hero line). The old
  `og.png` carried the pre-v3 English "AI proposes… human-in-the-loop" card and
  was removed 2026-09-06; a new filename was chosen on purpose so KakaoTalk/Slack
  scrapers don't keep serving the cached old card. Source: an HTML mock rendered
  in Chrome at 1200×630 — redo the same way if the hero line changes.

**Adding a page:** section + one route file; copy in `content.ko`; nav entry in
`site.ts` if it belongs in the nav.

**Notes (`/notes/<slug>/`, since 2026-09-06)** are the one long-form surface:
evidence articles hung off a service page. Body is Markdown in
`src/content/notes/<slug>.md` (collection `notes`, schema in
`src/content.config.ts`: title, description, date, service). `Note.astro`
renders it with a `TechArticle` JSON-LD node (author = founder, publisher =
org). Rules: only write a note when there is a measurement to publish (the
2026-07-26 criterion — no generic guides); link it from its service page via
`content.ko.services.<key>.notes`; add the URL to `lastmod.ts`; put any
published experiment files under `public/notes/<slug>/` and link them from
the note. Language is decided by path: `notes/<slug>.md` is Korean
(`/notes/<slug>/`), `notes/en/<slug>.md` is English (`/en/notes/<slug>/`); the
same slug in both makes a translation pair and `Note.astro` emits the hreflang
pair through Base's `hreflang` prop (the only pages besides `/`↔`/en/` that
carry one). Add both URLs to `lastmod.ts`. The first note is `korean-tokenizer`
(experiment record in `~/Projects/docs/tokenizer-experiment-2026-09.md`); its
English twin is what `content.en.page.caseHref` points at.

## URLs and redirects

- **Internal links always end in `/`** (`/services/search/`, `/work/#pipeline`,
  `/contact/?service=rtm#form`) — `trailingSlash: 'always'` in astro.config, and
  `scripts/check-dist-links.mjs` (runs as part of `npm run build`) fails the build
  on any internal `href` without one. GitHub Pages 301s `/about` → `/about/`, so a
  slash-less link costs a redirect on every click and crawl (found 2026-09-06:
  every nav/footer link on the site did this). Paths live in `src/config/site.ts`
  (nav, servicePages, legalLinks) and `content.ts` hrefs.
- **GitHub Pages cannot 301.** Real redirects are **Cloudflare Single Redirects
  rules** on the sizlon.io zone (six rules, listed in plan v3 §1). The hand-written
  stubs in `src/pages/**` (`meta refresh` + JS + canonical) are only the fallback
  for when a rule is missing — keep them until `scripts/smoke-live.sh` shows the
  301s, then they can go.
- **Stubs are `<RedirectStub target=… />`** (`src/components/RedirectStub.astro`):
  meta refresh + JS keep the fragment, the canonical is emitted **absolute and
  without the fragment** (Google ignores a canonical with `#…`, so
  `/services/data/#how` as a canonical was no canonical at all until 2026-09-06).
- **Stubs carry `canonical` + sitemap exclusion, never `noindex`** (2026-08-08,
  GSC-verified): `noindex` plus a canonical pointing elsewhere is a conflicting
  signal and Google may apply the `noindex` to the *target*. `SITEMAP_EXCLUDE`
  in `astro.config.mjs` is the only thing keeping stubs out of the index —
  when you add a stub, add its path there.
- **Never use Astro's `redirects:` config** — it emits `noindex` on the generated
  page and you cannot turn it off (the conflict above).
- **No two-hop redirects.** `/ko/*` variants of old product URLs go straight to
  the final destination (rules 1–4 before rule 6; same in `src/pages/ko/[...slug]`).
- **hreflang** exists for `/` ↔ `/en/` (automatic in Base.astro) and for note
  translation pairs (passed in by Note.astro); nothing else. The sitemap
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
