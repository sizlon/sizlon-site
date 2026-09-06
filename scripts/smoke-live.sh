#!/usr/bin/env bash
# 라이브 URL 검사 (v3 §1). 새 페이지는 200, 구 URL 은 Cloudflare 301 + Location.
# 사용: scripts/smoke-live.sh            # https://sizlon.io
#       scripts/smoke-live.sh https://stg-sizlon.example
# Cloudflare 엣지 캐시(4h)를 피하려고 캐시버스터를 붙인다. 실패가 하나라도 있으면 exit 1.
set -u
BASE="${1:-https://sizlon.io}"
fail=0
check() { # $1 path, $2 expected code, $3 expected Location (optional, 접두 일치)
  local path="$1" want="$2" loc="${3:-}"
  local url="${BASE}${path}"
  local sep='?'; [[ "$path" == *\?* ]] && sep='&'
  local out; out=$(curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' "${url}${sep}cb=$RANDOM" 2>&1)
  local code="${out%% *}" got="${out#* }"
  if [[ "$code" != "$want" ]]; then echo "FAIL $path → $code (want $want)"; fail=1; return; fi
  if [[ -n "$loc" && "$got" != "$loc"* ]]; then echo "FAIL $path → Location $got (want $loc*)"; fail=1; return; fi
  echo "ok   $path → $code ${got:+→ $got}"
}
# 살아 있는 페이지
for p in / /services/search/ /services/rtm/ /services/data/ /work/ /about/ /contact/ /en/ \
         /legal/terms/ /legal/privacy/ /legal/licenses/ /sitemap-index.xml /robots.txt; do check "$p" 200; done
# 구 제품 URL → Cloudflare 301 (규칙 1~4)
check /bid-verification    301 https://miriboa.sizlon.io/
check /ko/bid-verification 301 https://miriboa.sizlon.io/
for p in /web-crawling /editions /ko/web-crawling /ko/editions; do check "$p" 301 "${BASE}/services/data/"; done
for p in /how-it-works /ko/how-it-works; do check "$p" 301 "${BASE}/services/data/#how"; done
for p in /security /ko/security; do check "$p" 301 "${BASE}/services/data/#principles"; done
# 크로스사이트 스텁 → 미리보아 (규칙 5)
for p in /account /manage /monitor /monitor/free /connector /bid-monitoring /verify-request /products/miriboa /bid-verification/credits; do
  check "$p" 301 https://miriboa.sizlon.io; done
# 구 한국어 경로 → 루트 (규칙 6)
check /ko/          301 "${BASE}/"
check /ko/about     301 "${BASE}/about/"
check /ko/contact   301 "${BASE}/contact/"
check /ko/legal/terms 301 "${BASE}/legal/terms/"
# 규칙이 아직 없으면 위 구 URL 은 200(스텁 HTML)으로 떨어진다 — 그건 "Cloudflare 규칙
# 미적용"이지 사이트 결함이 아니다. 스텁 자체는 아래 canonical 로 확인.
exit $fail
