/*
 * 사이트 설정 — 내비, 서비스 목록, 연락 채널, 폼 엔드포인트. 카피는 content.ts.
 * 2026-09-05 개편 v3(~/Projects/docs/sizlon-site-restructure-plan-v3.md):
 * 제품 사이트가 아니라 서비스 셋(검색 진단·감리 대응 RTM·데이터 피드)을 파는
 * 회사 사이트. 미리보아는 증거물(/work), 크롤러는 도구 문장 한 줄.
 */
// 환경별 호스트 재매핑 — miriboa-site와 동일 장치(그쪽 site.ts 주석 참조).
const DEV_HOSTS: Array<[string, string]> = [
  ['https://svc.sizlon.io', 'https://svc.localhost'],
];
const STAGING_HOSTS: Array<[string, string]> = [
  ['https://svc.sizlon.io', 'https://stg-svc.sizlon.io'],
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
  contactEmail: 'hello@sizlon.io',
  // 전화는 영업 채널이다(2026-09-05, v3 §3.7 — 07-29 "표기 의무용" 규칙 철회).
  // 평일 09–18 응대, 히어로·/contact 최상단, tel: 링크·JSON-LD telephone 허용.
  contactPhone: '02-702-5795',
  contactPhoneIntl: '+82-2-702-5795',
  // 20분 통화 예약 링크. 비어 있으면 CTA 가 /contact 폼으로 떨어진다 — 예약
  // 도구(Google Calendar 예약 일정 등) URL 이 정해지면 여기 한 줄만 채운다.
  bookingUrl: 'https://calendar.app.google/Du1gf9ZL7b9k2WJT7',
  // Upwork 프로필. 비어 있으면 /en/ 에서 그 링크를 숨긴다.
  upworkUrl: '',
  // 문의 폼 엔드포인트 — sizlon-platform site-backend `/api/contact`.
  contactFormEndpoint: 'https://svc.sizlon.io/api/contact',
  // Cloudflare Turnstile site key (public).
  turnstileSiteKey: '0x4AAAAAADzkjelT6SU8nIio',
  miriboaUrl: 'https://miriboa.sizlon.io/',
});

/** 20분 통화 예약 CTA 의 목적지 — 예약 링크가 없으면 폼으로. */
export function bookingHref(service?: string): string {
  if (site.bookingUrl) return site.bookingUrl;
  return service ? `/contact/?service=${service}#form` : '/contact/#form';
}

// 내부 경로는 항상 `/…/` (astro.config trailingSlash 'always', 슬래시 없으면 GitHub Pages 가 301).
// 전역 내비 — 서비스 셋이 먼저, 근거(만든 것들)·회사·문의 순. 라벨은 content[lang].nav.
export const nav = [
  { href: '/services/search/', key: 'search' },
  { href: '/services/rtm/', key: 'rtm' },
  { href: '/services/data/', key: 'data' },
  // 실측 노트(2026-09-07, 개선 작업 C) — 노트가 유입의 주 경로라 서비스 셋 바로 뒤.
  // '만든 것들'은 헤더에서 뺐다(오너 결정 09-07): 7항목이면 821~900px 에서 줄바꿈. 푸터 열·홈 버튼·노트에서 간다.
  { href: '/notes/', key: 'notes' },
  { href: '/about/', key: 'about' },
  { href: '/contact/', key: 'contact' },
] as const;

export const servicePages = [
  { href: '/services/search/', key: 'search', topic: 'search' },
  { href: '/services/rtm/', key: 'rtm', topic: 'rtm' },
  { href: '/services/data/', key: 'data', topic: 'datafeed' },
] as const;

export const legalLinks = [
  { href: '/legal/terms/', key: 'Terms' },
  { href: '/legal/privacy/', key: 'Privacy' },
  { href: '/legal/licenses/', key: 'Licenses' },
] as const;

// JSON-LD @id — 회사 노드(Base.astro)와 대표 노드(/founder)가 페이지를 넘어 같은 개체로 묶이는 열쇠.
export const ORG_ID = 'https://sizlon.io/#org';
export const FOUNDER_ID = 'https://sizlon.io/founder/#person';
