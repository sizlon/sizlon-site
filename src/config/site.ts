/*
 * Thin shared-meta contract for the marketing site (see DESIGN_DIRECTION.md).
 * The only coupling point to the rest of the monorepo. In a later step these
 * values (portal URL, version) can be generated from build_info() / a shared file.
 */
// 환경별 호스트 재매핑 — miriboa-site와 동일 장치(그쪽 site.ts 주석 참조).
// dev 서버(astro dev)는 로컬 스택(*.localhost), SITE_TARGET=staging 빌드는
// hnlab 스테이징(stg-*), 기본 빌드는 프로드 URL 그대로.
const DEV_HOSTS: Array<[string, string]> = [
  ['https://svc.sizlon.io', 'https://svc.localhost'],
  ['https://portal.sizlon.io', 'https://portal.localhost'],
];
const STAGING_HOSTS: Array<[string, string]> = [
  ['https://svc.sizlon.io', 'https://stg-svc.sizlon.io'],
  ['https://portal.sizlon.io', 'https://stg-portal.sizlon.io'],
];

function devRemap<T extends Record<string, string>>(config: T): T {
  const hostMap = import.meta.env.DEV
    ? DEV_HOSTS
    : (typeof process !== 'undefined' && process.env.SITE_TARGET === 'staging')
      ? STAGING_HOSTS
      : null;
  if (!hostMap) return config;
  const remapped = { ...config } as Record<string, string>;
  for (const [key, value] of Object.entries(remapped)) {
    for (const [prodHost, mappedHost] of hostMap) {
      if (value.startsWith(prodHost)) remapped[key] = mappedHost + value.slice(prodHost.length);
    }
  }
  return remapped as T;
}

export const site = devRemap({
  name: 'Sizlon',
  tagline: 'AI proposes. A deterministic layer verifies.',
  portalLoginUrl: 'https://portal.sizlon.io',
  contactEmail: 'hello@sizlon.io',
  // 대표전화는 사업자 표기 의무용이다 — 전화 응대는 하지 않으므로 문의 채널로
  // 노출하지 않는다(푸터 사업자정보 줄과 법적 고지에만 등장). 문의는 이메일·폼.
  contactPhone: '02-702-5795',
  // Contact form endpoint — a Google Apps Script web-app /exec URL. Paste the
  // deployed URL here to activate the form; while empty, the form no-ops on
  // submit and the mailto fallback carries. Not a secret (it's client-visible).
  contactFormEndpoint: 'https://svc.sizlon.io/api/contact',
  // 미리보아 앱 엔드포인트(구독·결제·크레딧·위저드·계정·공고조회·precheck·/r)는
  // 여기 없다. 2026-07-23 분리로 그 화면들이 전부 miriboa-site로 갔고, 정본은
  // 그쪽 src/config/site.ts다. 이 사이트는 문의 폼 하나만 svc를 호출한다.
  // 미리보아 엔드포인트가 다시 필요해 보이면 그건 이 사이트가 제품 사이트를
  // 흉내내고 있다는 신호다 — AGENTS.md "Products & navigation" 참조.
  // Cloudflare Turnstile site key (public). Set this AND the TURNSTILE_SECRET
  // script property in Apps Script to activate bot verification. While empty,
  // the widget is not rendered and the server skips the Turnstile check.
  turnstileSiteKey: '0x4AAAAAADzkjelT6SU8nIio',
});

// Global nav — buyer-first. Each product has its own problem-first landing and a
// direct nav entry (each buyer reaches their product in one hop — CONTEXT §94 IA
// audit, P4). There is no umbrella /products page: the homepage already carries the
// both-products overview, so a separate list page was redundant. Crawler's sub-pages
// (How it works / Security / Editions) stay scoped under that product (see
// crawlerPages), not in the company-level nav. Labels come from content[lang].
export const nav = [
  // 미리보아는 전용 서비스 사이트로 분리(2026-07-23). 네비는 회사 사이트 안의
  // 소개 페이지(/bid-verification)로 — 외부 점프는 그 페이지의 CTA가 담당한다.
  { href: '/bid-verification', key: 'Miriboa' },
  { href: '/web-crawling', key: 'Crawler Platform' },
  // 회사 사이트인데 회사를 설명하는 페이지가 없었다(2026-07-29 추가).
  { href: '/about', key: 'About' },
  { href: '/contact', key: 'Contact' },
] as const;

// Crawler Platform's own sub-pages. Surfaced from the crawler product page and
// the footer — scoped under the product rather than the global nav. The routes
// stay top-level; only their placement in navigation is scoped.
export const crawlerPages = [
  { href: '/how-it-works', key: 'How it works' },
  { href: '/security', key: 'Security' },
  { href: '/editions', key: 'Editions' },
] as const;

// Miriboa's own sub-pages — same scoping rule as crawlerPages: the routes stay
// top-level, only their placement in navigation is scoped to the product.
//
// /precheck is deliberately NOT here. It answers "can our pipeline read this
// file?", which only matters to someone already headed for the paid
// verification — it is a step inside that path, not a free offer standing on
// its own, so it is surfaced from the Miriboa page's delivery note instead.
// (Demonstrating the parsing capability, its other original job, is now done
// far better by the connector reading a real notice in chat.)
export const miriboaPages = [
  { href: 'https://miriboa.sizlon.io/bid-monitoring', key: 'Free alerts' },
  // 미 연방조달(SAM.gov·주한미군) 랜딩. 시장 축이 URL로 분리돼(2026-08-04) 자기
  // 주소를 갖는다 — 회사 사이트에서 해외 축이 아예 안 보이던 것을 여는 링크다.
  { href: 'https://miriboa.sizlon.io/sam/bid-verification/', key: 'Federal' },
  { href: 'https://miriboa.sizlon.io/tools/notice', key: 'Tools' },
  { href: 'https://miriboa.sizlon.io/connector', key: 'Connector' },
  { href: 'https://miriboa.sizlon.io/pricing', key: 'Pricing' },
] as const;

// The MCP connector endpoint users paste into Claude. Public, no auth.
export const connectorUrl = 'https://parse.sizlon.io/mcp/';

// The product line. `categoryKey` labels the domain (product-neutral — the
// company umbrella is the shared "propose then verify" DNA, not one lifecycle).
// `deliveryKeys` states how the product ships (secondary metadata, not a
// top-level taxonomy): self-hosted license, managed subscription, or a
// vendor-operated service. Labels come from content[lang].common.deliveries.
export type Solution = {
  slug: 'crawler-platform' | 'miriboa';
  name: string; // product name — same in every locale
  categoryKey: 'extraction' | 'verification';
  deliveryKeys: Array<'selfHosted' | 'managed' | 'service'>;
  status: 'live' | 'pilot' | 'next' | 'roadmap';
  href?: string;
};

export const solutions: Solution[] = [
  { slug: 'crawler-platform', name: 'Crawler Platform', categoryKey: 'extraction', deliveryKeys: ['selfHosted', 'managed'], status: 'live', href: '/web-crawling' },
  { slug: 'miriboa', name: 'Miriboa', categoryKey: 'verification', deliveryKeys: ['service'], status: 'live', href: 'https://miriboa.sizlon.io' },
];

export const legalLinks = [
  { href: '/legal/terms', key: 'Terms' },
  { href: '/legal/privacy', key: 'Privacy' },
  { href: '/legal/licenses', key: 'Licenses' },
] as const;
