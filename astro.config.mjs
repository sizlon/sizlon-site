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
  // 구 제품 URL 스텁 — 손으로 쓴 페이지가 되면서 사이트맵 후보로 올라온다.
  // noindex 를 안 달기로 했으므로(위 redirects 주석) 색인 후보에서 빼는 일은
  // 이 제외 목록이 혼자 진다.
  /\/products(\/|$)/,
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
  // 구 제품 URL 은 `redirects:` 가 아니라 **손으로 쓴 스텁**(src/pages/products/**)
  // 이 처리한다 (2026-08-08). 설정이 만드는 리디렉트 페이지는 noindex 를 강제로
  // 붙이는데, canonical 과 함께 달리면 신호가 모순돼 구글이 noindex 를 canonical
  // 대상(미리보아 홈·Crawler Platform 페이지)에 적용할 수 있다. GSC 통지로 드러났다.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: { prefixDefaultLocale: false },
  },
});
