/*
 * sitemap <lastmod> — 페이지별 **카피 최종 수정일** (2026-09-06, SEO 리뷰 8번).
 * 빌드 시각을 전부 박으면 매 배포마다 12페이지가 "오늘 바뀜"이 되어 구글이 lastmod 를
 * 통째로 무시한다 — 그래서 손으로 적는다. 규약: content.ts 에서 어느 페이지의 카피를
 * 고치면 여기 그 경로의 날짜도 같은 커밋에서 올린다(디자인·마크업만 바뀐 건 안 올림).
 * 법적 페이지는 본문에 보이는 `content.ko.legal.updated` 와 같은 값을 유지한다.
 * 경로는 sitemap 의 loc 과 같은 꼴(`/…/`). 여기 없는 경로는 lastmod 없이 나간다.
 */
export const LASTMOD: Record<string, string> = {
  '/': '2026-09-06',
  '/en/': '2026-09-06',
  '/services/search/': '2026-09-06',
  '/notes/korean-tokenizer/': '2026-09-06',
  '/en/notes/korean-tokenizer/': '2026-09-06',
  '/notes/korean-tables/': '2026-09-06',
  '/services/rtm/': '2026-09-06',
  '/services/data/': '2026-09-06',   // 09-06 실측 노트 링크 추가
  '/work/': '2026-09-06',
  '/about/': '2026-09-06',
  '/founder/': '2026-09-06',
  '/contact/': '2026-09-06',
  '/legal/terms/': '2026-09-06',
  '/legal/privacy/': '2026-09-06',
  '/legal/licenses/': '2026-09-06',
};
