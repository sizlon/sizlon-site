/*
 * sitemap <lastmod> — 페이지별 **카피 최종 수정일** (2026-09-06, SEO 리뷰 8번).
 * 빌드 시각을 전부 박으면 매 배포마다 12페이지가 "오늘 바뀜"이 되어 구글이 lastmod 를
 * 통째로 무시한다 — 그래서 손으로 적는다. 규약: content.ts 에서 어느 페이지의 카피를
 * 고치면 여기 그 경로의 날짜도 같은 커밋에서 올린다(디자인·마크업만 바뀐 건 안 올림).
 * 법적 페이지는 본문에 보이는 `content.ko.legal.updated` 와 같은 값을 유지한다.
 * 경로는 sitemap 의 loc 과 같은 꼴(`/…/`). 여기 없는 경로는 lastmod 없이 나간다.
 */
export const LASTMOD: Record<string, string> = {
  '/': '2026-09-07',   // 09-07 개선 작업: 작업 방식 위치·카드 관계 줄·만든 것들 3번째·무료 스캔 줄
  '/en/': '2026-09-07',   // 09-07 검색 블록 포지셔닝·Case studies 링크
  '/notes/': '2026-09-07',
  '/en/notes/': '2026-09-07',
  '/services/search/': '2026-09-07',   // 09-07 H1·FAQ 3건·분할 금액·무료 스캔·이 다음에
  '/notes/korean-tokenizer/': '2026-09-07',   // 09-07 동의어 각주(4d3576c, 당시 미갱신) + metaTitle
  '/en/notes/korean-tokenizer/': '2026-09-07',
  '/notes/korean-tables/': '2026-09-06',
  '/en/notes/korean-tables/': '2026-09-06',
  '/services/rtm/': '2026-09-07',   // 09-07 이 다음에 보통 필요한 것
  '/services/data/': '2026-09-07',   // 09-07 이 다음에 보통 필요한 것
  '/work/': '2026-09-06',
  '/about/': '2026-09-08',   // 09-08 크롤러 문장 사실 정정(자동 복구는 시즐론에서 더한 것)
  '/founder/': '2026-09-06',
  '/contact/': '2026-09-07',   // 09-07 무료 스캔 안내
  '/legal/terms/': '2026-09-06',
  '/legal/privacy/': '2026-09-06',
  '/legal/licenses/': '2026-09-06',
};
