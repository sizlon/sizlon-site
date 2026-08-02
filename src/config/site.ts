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
  // Free notice-alert subscription (site-backend, double opt-in). Empty = form no-ops.
  subscribeEndpoint: 'https://svc.sizlon.io/api/subscribe',
  // Eligibility profile (A2) — token-authed GET (prefill) + POST (save). Empty = no-op.
  subscribeProfileEndpoint: 'https://svc.sizlon.io/api/subscribe/profile',
  // Paid screening application — one form (alert settings + company credentials);
  // creates the pending subscription + profile + account, then the confirmation
  // email's link goes straight to checkout (confirm?next=billing → 302).
  subscribeScreeningEndpoint: 'https://svc.sizlon.io/api/subscribe/screening',
  // Paid tier — Toss Payments monthly subscription (billing key). The checkout
  // endpoint returns the public Toss clientKey + a per-subscriber customerKey;
  // confirm exchanges the redirect authKey for a billingKey and charges month 1.
  billingCheckoutEndpoint: 'https://svc.sizlon.io/api/billing/checkout',
  billingConfirmEndpoint: 'https://svc.sizlon.io/api/billing/confirm',
  billingStatusEndpoint: 'https://svc.sizlon.io/api/billing/status',
  billingCancelEndpoint: 'https://svc.sizlon.io/api/billing/cancel',
  // Verification credits (self-serve 입찰검증) — one-time Toss payment. checkout
  // returns packs+orderIds (session-authed); confirm approves and credits the ledger.
  creditsEndpoint: 'https://svc.sizlon.io/api/credits',
  creditsCheckoutEndpoint: 'https://svc.sizlon.io/api/credits/checkout',
  creditsConfirmEndpoint: 'https://svc.sizlon.io/api/credits/confirm',
  // Miriboa verification-request endpoint (site-backend, same host). The
  // connector and the site post the SAME form here; only `src` differs so we can
  // compare which surface converts (CONTEXT §94). While empty, the form no-ops.
  verifyRequestEndpoint: 'https://svc.sizlon.io/api/verification-request',
  // Multi-step wizard: step 2 creates a draft here; documents upload and the final
  // finalize go through manageBase/<token>/documents and /finalize.
  verifyDraftEndpoint: 'https://svc.sizlon.io/api/verification-draft',
  authRequestEndpoint: 'https://svc.sizlon.io/auth/request',
  authVerifyEndpoint: 'https://svc.sizlon.io/auth/verify',
  authLoginEndpoint: 'https://svc.sizlon.io/auth/login',
  authLogoutEndpoint: 'https://svc.sizlon.io/auth/logout',
  authSetPasswordEndpoint: 'https://svc.sizlon.io/auth/set-password',
  accountRequestsEndpoint: 'https://svc.sizlon.io/account/requests',
  accountProductsEndpoint: 'https://svc.sizlon.io/account/products',
  accountProfileEndpoint: 'https://svc.sizlon.io/account/profile',
  // Notice lookup (parse.sizlon.io, has the g2b key server-side). The verify form
  // calls GET ?no=<공고번호> to auto-fill 공고명·마감일·기관명·판돈. CORS-allowed for sizlon.io.
  noticeLookupEndpoint: 'https://parse.sizlon.io/api/notice',
  // Precheck (miriboa-precheck, check.sizlon.io): parses each dropped file transiently
  // (deleted immediately, no AI reads it) to flag scans/corrupt files before submission.
  precheckEndpoint: 'https://check.sizlon.io/api/precheck',
  // Manage-request base (site-backend). The /manage page reads ?t=<token> and calls
  // GET <base>/<token>, POST <base>/<token>/documents, POST <base>/<token>/delete.
  manageBase: 'https://svc.sizlon.io/r',
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
