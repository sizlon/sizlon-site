// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public Sizlon marketing site. Static output, bilingual (en default + ko).
// https://astro.build/config
// sitemap 제외: 미리보아 분리(2026-07-23) 후 남은 리디렉트 스텁 전부. 이 목록은
// 해당 스텁의 noindex와 쌍으로 움직인다 — 스텁은 색인 대상이 아니라 메일에 나간
// 토큰 링크를 서비스 사이트로 넘기기 위한 경유지다.
const SITEMAP_EXCLUDE = [
  /\/(monitor|bid-monitoring|account|manage|verify-request|connector)(\/|$)/,
  /\/bid-verification\/credits(\/|$)/,
];

export default defineConfig({
  site: 'https://sizlon.io',
  // dev 포트 고정: miriboa-site(4321)와 동시에 뜰 수 있게 4322 — 로컬 Caddy가
  // sizlon.localhost → 4322 로 프록시한다 (sizlon-dev-harness README 주소표).
  server: { port: 4322, host: true },
  integrations: [sitemap({
    filter: (page) => !SITEMAP_EXCLUDE.some((re) => re.test(new URL(page).pathname)),
    // en 루트 + /ko 하위 쌍에 xhtml:link hreflang alternates를 붙인다.
    i18n: { defaultLocale: 'en', locales: { en: 'en-US', ko: 'ko-KR' } },
  })],
  // Legacy product URLs — landing pages moved top-level with function slugs.
  redirects: {
    '/products/miriboa': 'https://miriboa.sizlon.io',
    '/products/crawler-platform': '/web-crawling',
    '/ko/products/miriboa': 'https://miriboa.sizlon.io',
    '/ko/products/crawler-platform': '/ko/web-crawling',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: { prefixDefaultLocale: false },
  },
});
