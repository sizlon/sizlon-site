# sizlon.io — company site

Sizlon company site. Static [Astro](https://astro.build) output, Korean-first
(Korean at the root, one English page at `/en/`), deployed to GitHub Pages at
[sizlon.io](https://sizlon.io).

Sells three founder-delivered services — Korean search-quality diagnostics,
audit-response requirements traceability (RTM), monthly data feeds — with
Miriboa and the KONEPS bid-opening pipeline as evidence (`/work`). Restructured
2026-09-05 (plan v3: `~/Projects/docs/sizlon-site-restructure-plan-v3.md`).

## Structure

```text
src/
├── pages/        # routes (Korean at root, /en/ one page, redirect stubs); thin — render a section
├── sections/     # page bodies (Home, Service, Work, About, Contact, En, Legal)
├── components/   # Nav, Footer
├── layouts/      # Base.astro (html shell + meta)
├── config/       # site.ts — nav, product list, endpoints, keys
├── i18n/         # content.ts (ko copy + en one-pager + chrome labels) + utils
└── styles/       # global.css
```

Content lives in `src/i18n/content.ts` so markup stays language-free; page bodies
read `content.ko`, chrome reads `content[lang]`. See `AGENTS.md` for dev-server notes.

## Documentation

- **[AGENTS.md](AGENTS.md)** (aliased as `CLAUDE.md`) — dev-server notes
  (background mode) and the Astro guides to consult when working on the site.
  architecture, configuration, the Apps Script backend, Cloudflare Turnstile
  setup, and troubleshooting for the contact form.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
