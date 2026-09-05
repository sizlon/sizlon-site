// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 시즐론 회사 사이트. 정적 출력, 한국어 기본(루트) + 영어 /en/ 한 장 (2026-09-05 개편 v3).
// https://astro.build/config
//
// sitemap 제외: 미리보아 분리(2026-07-23) 후 남은 리디렉트 스텁 전부 + v3 로 스텁이
// 된 구 제품 URL(/bid-verification /web-crawling /how-it-works /security /editions)
// + 구 한국어 경로(/ko/*). 스텁은 noindex 를 달지 않으므로(아래 주석) 색인 후보에서
// 빼는 일은 이 제외 목록이 혼자 진다.
const SITEMAP_EXCLUDE = [
  /\/(monitor|bid-monitoring|account|manage|verify-request|connector)(\/|$)/,
  /\/bid-verification(\/|$)/,
  /\/(web-crawling|how-it-works|security|editions)(\/|$)/,
  /\/products(\/|$)/,
  /\/ko(\/|$)/,
];

export default defineConfig({
  site: 'https://sizlon.io',
  // dev 포트 고정: miriboa-site(4321)와 동시에 뜰 수 있게 4322 — 로컬 Caddy가
  // sizlon.localhost → 4322 로 프록시한다 (sizlon-dev-harness README 주소표).
  server: { port: 4322, host: true },
  integrations: [sitemap({
    filter: (page) => !SITEMAP_EXCLUDE.some((re) => re.test(new URL(page).pathname)),
    // sitemap 의 i18n 옵션은 쓰지 않는다 — 모든 페이지에 en 짝이 있다고 가정해
    // 존재하지 않는 /en/about 같은 alternate 를 만든다. hreflang 은 Base.astro 가
    // 홈(/ ↔ /en/) 한 쌍에만 단다.
  })],
  // 구 URL 은 `redirects:` 가 아니라 **손으로 쓴 스텁**이 처리한다 (2026-08-08).
  // 설정이 만드는 리디렉트 페이지는 noindex 를 강제로 붙이는데, canonical 과 함께
  // 달리면 신호가 모순돼 구글이 noindex 를 canonical 대상에 적용할 수 있다.
  // 진짜 301 은 앞단 Cloudflare Single Redirects 규칙이 낸다(v3 §1) — 스텁은 폴백.
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
