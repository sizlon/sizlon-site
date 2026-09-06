// 콘텐츠 컬렉션 (2026-09-06). `notes` = 서비스 페이지에 매달린 증거 글 — 실측이 있을 때만 쓴다
// (일반 가이드 글은 안 쓴다, 07-26 기준). 본문은 마크다운, 메타는 아래 스키마. 카피 규약은
// content.ts 와 같다(숫자는 실험 기록에서만, 금칙어 동일). 글을 추가하면 lastmod.ts 에도 한 줄.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),          // YYYY-MM-DD, 발행일 = lastmod 초기값
    /** 이 글이 증거가 되는 서비스 — 그 페이지가 이 글을 링크한다 */
    service: z.enum(['search', 'rtm', 'data']),
    eyebrow: z.string().default('노트'),
  }),
});

export const collections = { notes };
