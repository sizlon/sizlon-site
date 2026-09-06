// dist 의 내부 링크가 전부 `/path/` 꼴인지 검사한다 (2026-09-06).
// GitHub Pages 는 `/about` 을 `/about/` 로 301 하므로, 슬래시 없는 내부 href 는 클릭·크롤마다
// 리다이렉트 한 번을 먹고 canonical(`/about/`)과도 어긋난다. 파일(확장자 있음)·앵커·외부는 제외.
// 사용: node scripts/check-dist-links.mjs  (npm run build 가 astro build 뒤에 실행)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (n.endsWith('.html')) files.push(p);
  }
})(root);

const bad = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/\shref="(\/[^"]*)"/g)) {
    const path = m[1].split(/[?#]/)[0];
    if (/\.[a-z0-9]+$/i.test(path)) continue; // /favicon.svg, /og.png …
    if (!path.endsWith('/')) bad.push(`${f}: ${m[1]}`);
  }
}
if (bad.length) {
  console.error(`check-dist-links: ${bad.length} internal href(s) without trailing slash\n` + [...new Set(bad)].join('\n'));
  process.exit(1);
}
console.log(`check-dist-links: ok (${files.length} html files)`);
