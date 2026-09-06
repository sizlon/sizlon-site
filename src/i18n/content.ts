/*
 * 사이트 카피 정본. 한국어(ko)가 기본 로케일이고 루트에 산다. 영어(en)는
 * /en/ 한 장(Upwork 용)과 공용 크롬(내비·푸터) 라벨만 가진다 — 2026-09-05 개편
 * v3(~/Projects/docs/sizlon-site-restructure-plan-v3.md). 페이지 본문은 전부
 * `content.ko.*` 에서 읽고, Base/Nav/Footer 만 `t(lang)` 으로 두 로케일을 본다.
 *
 * 숫자 규율(v3 §2): 아래 `proof` 블록의 문장만 쓴다. 시즐론 크롤러의 규모·건수,
 * 고객 수, 절감액은 쓰지 않는다(실적 없음). 미리보아 가격·SLA·크레딧 규칙은
 * 이 사이트에서 재기술하지 않는다(정본은 miriboa.sizlon.io).
 */

// ── 확정 근거 문장 (v3 §2) — 사이트 전체에서 이 문장만 쓴다 ──────────────
const proof = {
  careerFull: '코리아뉴스와이어 재직 시 언론 모니터링 서비스 미디어비의 수집·검색 인프라 구축·운영 — 매체 7,000여 곳, 일평균 신규 기사 20만 건 인덱싱',
  careerShort: '매체 7,000곳 · 일 20만 건 수집·색인 인프라 구축·운영 (前 코리아뉴스와이어)',
  current: '나라장터 개찰 데이터 6개월분 수집·첨부 파싱·집계 — 협상에 의한 계약 응찰 73,373건·업체 13,220곳 (시즐론)',
  engine: '미리보아 요구조건 추출·대조 엔진 — 골든셋 기준 recall 87.4%, "확실" 판정 precision 96.5%',
  tool: 'API가 있으면 API로, 없으면 자체 자동 복구 크롤러로 수집합니다.',
  en: 'Built and ran ingestion & search infra for a media-monitoring service: 7,000 news sources, ~200K new articles/day (prior role at Korea Newswire)',
} as const;

const method = '자동화가 제안하고, 규칙이 검증하고, 사람이 승인합니다. 모든 판정에 원문 근거가 붙고, 확인 안 되는 것은 단정하지 않습니다.';

export const content = {
  ko: {
    proof,
    common: {
      menu: '메뉴',
      skip: '본문으로 건너뛰기',
      call: '전화',
      book: '20분 통화 예약',
      hours: '평일 09–18',
      email: '이메일',
      langSwitch: 'EN',
      koreanSite: '한국어 사이트',
      legalNote: '법적 고지',
      vatNote: '표시 가격은 모두 부가세 별도입니다.',
      fixedLine: '고정가 · 결과물 명시 · 대표가 직접 수행',
    },
    nav: { search: '검색 품질 진단', rtm: '감리 대응 RTM', data: '데이터 피드', work: '만든 것들', about: '회사 소개', contact: '문의', founder: '대표 소개' },
    footer: {
      tagline: 'AI proposes. A deterministic layer verifies.',
      services: '서비스',
      work: '만든 것들',
      company: '회사',
      legal: '법적 고지',
      principles: '데이터 수집 원칙',
      workItems: [
        { href: '/work/#miriboa', label: '미리보아' },
        { href: '/work/#pipeline', label: '개찰 데이터 파이프라인' },
      ],
      baseline: '고정가 · 결과물 명시 · 대표가 직접 수행',
      business: '주식회사 시즐론 · 대표 이광연 · 사업자등록번호 420-86-03864 · 전화 02-702-5795 · 서울특별시 용산구 원효로 189-7, 302호 · hello@sizlon.io',
    },
    legalNav: { Terms: '약관', Privacy: '개인정보처리방침', Licenses: '라이선스' },

    // ── 홈 (v3 §3.1) ───────────────────────────────────────────────────
    home: {
      title: '시즐론 | 검색 진단·감리 대응·데이터 피드',
      // 메타 설명은 서비스명이 앞 80자(모바일 스니펫) 안에 오도록 — 경력은 뒤로 (2026-09-06).
      description: '검색 품질 진단(Elasticsearch·OpenSearch), 공공 SI 감리 대응 문서, 월정액 데이터 피드 — 매체 7,000곳에서 하루 20만 건을 수집·색인하던 검색 엔지니어가 직접 합니다. 고정가, 결과물 명시.',
      h1: '검색 시스템, RAG, 데이터 추출 — 실제로 운영해 본 사람이 합니다.',
      lede: '매체 7,000곳에서 하루 20만 건을 수집·색인하던 검색 엔지니어입니다. 검색 품질을 진단하고, 공공 SI 감리 문서를 만들고, 필요한 데이터를 매달 납품합니다.',
      servicesEyebrow: '서비스',
      servicesH2: '셋 중 하나를 고르거나, 먼저 통화로 범위를 잡습니다.',
      cards: [
        { key: 'search', name: '검색 품질 진단', terms: '2주 · 250만원', deliverable: '진단 보고서 + 즉시 적용 설정' },
        { key: 'rtm', name: '감리 대응 RTM', terms: '감리 1회분 150~200만원 · 전체 400~500만원', deliverable: '요구사항 추적표 + 대조 리포트' },
        { key: 'data', name: '데이터 피드', terms: '구축 100~300만원 + 월 30~80만원', deliverable: '매달 오는 정제 데이터' },
      ],
      methodEyebrow: '작업 방식',
      method,
      // "왜 이 사람인가" 절은 09-06 에 없앴다 — 경력은 히어로 부제·대표 소개가, 실적 숫자는
      // 그 숫자를 만든 것 옆(아래 workItems)에 붙는다.
      workEyebrow: '만든 것들',
      workLine: '시즐론 명의로 만들고 실제로 쓰이는 것들입니다.',
      workItems: [
        { name: '미리보아', proof: '골든셋 기준 recall 87.4% · "확실" 판정 precision 96.5%', href: '/work/#miriboa' },
        { name: '나라장터 개찰 데이터 파이프라인', proof: '협상에 의한 계약 응찰 73,373건 · 업체 13,220곳 (6개월분)', href: '/work/#pipeline' },
      ],
      workLink: '만든 것들 보기',
      closingH2: '어느 쪽이든 먼저 20분 통화로 범위를 잡습니다.',
    },

    // ── 서비스 3종 (v3 §3.2~3.4) ───────────────────────────────────────
    services: {
      search: {
        // <title> 은 접미 "— 시즐론" 이 붙으니 대시 없이 짧게(모바일 SERP ~30자). h1 은 별도.
        title: 'Elasticsearch·OpenSearch 검색 품질 진단',
        description: 'Elasticsearch/OpenSearch·Nori 검색 품질 진단 — 2주, 250만원 고정가. 실패 쿼리 골든셋 100건으로 before/after 를 측정하고, 바로 적용 가능한 analyzer·사전·동의어·랭킹 설정을 드립니다.',
        eyebrow: '서비스 · 검색 품질 진단',
        h1: '검색 품질 진단 — Elasticsearch · OpenSearch',
        sub: '"검색이 이상하다"를 수치로 바꾸고, 2주 안에 고친 설정을 드립니다.',
        price: '250만원 · 2주 · 고정가',
        // JSON-LD Offer 용 숫자(KRW, 부가세 별도) — 위 price 문구와 같은 값이어야 한다.
        offer: { minPrice: 2500000, maxPrice: 2500000 },
        priceNote: '골든셋 수치가 개선되지 않으면 2주차 비용은 청구하지 않습니다.',
        whoH: '이런 팀을 위해',
        who: [
          'ES/OpenSearch 를 운영 중인데 "검색이 이상하다"는 CS 가 반복되는 팀',
          'RAG 답이 엉뚱하게 나오는 팀 — 대부분 검색 문제입니다',
          '형태소·사전·동의어 관리의 주인이 없는 조직',
        ],
        howH: '진행',
        how: [
          { name: '1주 — 진단', text: '로그·설정 분석, 실패 쿼리 골든셋 100건 확정.', note: '골든셋을 동결하고 재측정하는 방법은 미리보아 벤치마크와 같습니다 — 같은 잣대로 요구조건 추출 재현율 73.5% → 87.4%.', link: { label: '벤치마크 보기', href: 'https://miriboa.sizlon.io/benchmark/' } },
          { name: '2주 — 재설정', text: 'analyzer·사전·동의어·랭킹 재설정, 골든셋으로 before/after 측정.' },
        ],
        deliverH: '결과물',
        deliverables: [
          '진단 보고서 — 문제 유형별 정량 근거',
          '바로 적용 가능한 settings·analyzer·사전 파일',
          '재현 가능한 평가 셋(골든셋 100건)',
        ],
        optionH: '옵션',
        options: ['하이브리드(BM25 + kNN) 설계 — 별도 견적'],
        // 근거는 절이 아니라 문장이다(2026-09-06 오너 결정): 누가 하는가는 히어로 가격 아래
        // 한 줄, 방법의 증거는 그 방법을 쓰는 진행 1주 항목에. ES 세부 태그는 대표 소개로.
        heroProof: [proof.careerShort + ' — 그 엔지니어가 직접 합니다.'],
        heroProofLink: { label: '대표 소개', href: '/founder/' },
        faqH: '자주 묻는 것',
        faq: [
          { q: '데이터를 반출해야 하나요?', a: '아닙니다. 읽기 계정과 화면 공유로 진행합니다. 로그·설정 파일이 밖으로 나가지 않습니다.' },
          { q: '어떤 스택을 다루나요?', a: 'Elasticsearch·OpenSearch, Nori 를 포함한 한국어 형태소 분석기, 사용자 사전·동의어 사전, BM25 랭킹. 그 외 스택은 통화에서 확인합니다.' },
          { q: '무엇을 보장하나요?', a: '수치로 보장합니다. 1주차에 확정한 골든셋 100건의 before/after 가 개선되지 않으면 2주차 비용을 청구하지 않습니다.' },
        ],
        crossLine: '색인할 외부 데이터가 필요하면 데이터 피드로 함께',
        crossHref: '/services/data/',
        // 증거 글(/notes/*) — 실측이 있는 글만. 글 본문은 src/content/notes/.
        notesH: '실측 노트',
        notes: [
          { label: '검색이 못 찾으면 RAG 는 답할 수 없다 — 한국어는 토크나이저부터 본다', href: '/notes/korean-tokenizer/', line: '공고명 183,240건, Nori 기본 vs 코퍼스 사전. P@10 0.906→0.986.' },
        ],
        cta: '20분 통화 예약',
      },
      rtm: {
        // 짧은 판(v3 §3.3 착수 조건): SI PM 통화 2~3건으로 "감리 대응"·"RTM"이
        // 그들 어휘인지 확인하기 전까지 제목·부제·CTA·가격·근거만 올린다.
        // 확인되면 아래 `brief` 를 false 로 — 나머지 블록은 이미 채워져 있다.
        brief: true,
        title: '감리 대응 요구사항 추적표(RTM) 패키지',
        description: '공공 SI 감리 대응 — RFP 요구사항 전부를 산출물과 대조해 감리 전에 빠진 것을 찾습니다. 요구사항 추적표(감리 제출 형식)·대조 리포트·지적사항 대응 초안. 감리 1회분 150~200만원.',
        eyebrow: '서비스 · 감리 대응',
        h1: '감리 대응 요구사항 추적표(RTM) 패키지',
        sub: 'RFP 요구사항 전부를 산출물과 대조해, 감리 전에 빠진 것을 찾습니다.',
        price: '감리 1회분 150~200만원 · 착수·중간·종료 전체 400~500만원',
        offer: { minPrice: 1500000, maxPrice: 2000000, unitText: '감리 1회분' },
        priceNote: '범위 확정 후 고정가.',
        whoH: 'PM 이 겪는 문제',
        who: [
          '감리마다 수백 개 요구사항을 손으로 대조합니다',
          '빠진 항목은 그대로 지적사항이 됩니다',
          '종료 감리를 통과하지 못하면 검수와 잔금이 밀립니다',
        ],
        howH: '하는 일',
        how: [
          { name: '추출', text: 'RFP·제안서에서 요구사항을 원자 단위로 추출합니다. 중복은 병합하고 의무·권고를 분류합니다.' },
          { name: '대조', text: '요구사항정의서·설계서·테스트결과서와 대조합니다. 항목마다 원문 근거가 붙습니다.' },
          { name: '보고', text: '미반영·부분반영 목록과 대응 초안을 드립니다.' },
        ],
        deliverH: '결과물',
        deliverables: [
          '요구사항 추적표 — 감리 제출 형식 엑셀',
          '대조 리포트 — 항목별 판정·근거 페이지',
          '지적사항 대응 초안',
        ],
        optionH: '',
        options: [],
        // 근거는 히어로 아래 두 문장(2026-09-06). 수치는 입찰 공고 문서에서 잰 것 — RTM
        // 정확도로 읽히지 않게 출처를 밝히고, 감리 산출물 측정치는 첫 프로젝트에서 만든다
        // (ENGINE_BOUNDARY.md: 도메인마다 골든셋을 새로 잡는다).
        heroProof: [
          '같은 엔진을 입찰 공고 문서에서 측정한 수치 — 요구조건 추출 recall 87.4%, "확실" 판정 precision 96.5%.',
          '감리 산출물(RFP·요구사항정의서·설계서·테스트결과서) 기준 측정치는 아직 없습니다. 첫 프로젝트에서 골든셋을 만들어 같은 방식으로 공개합니다.',
        ],
        heroProofLink: { label: '벤치마크 보기', href: 'https://miriboa.sizlon.io/benchmark/' },
        termsH: '조건',
        terms: ['NDA 체결 후 자료 수령', '자료는 납품 후 15일 내 파기', '대표가 직접 수행, 외부 인력 없음'],
        faqH: '',
        faq: [],
        crossLine: '경쟁 입찰·낙찰 동향은 데이터 피드로 매달',
        crossHref: '/services/data/',
        cta: 'RFP 와 산출물 목록만 주시면 하루 안에 범위와 견적을 드립니다',
      },
      data: {
        title: '데이터 피드, 매달 정제해서 납품',
        description: '공공 공고·HWP 첨부·PDF 표처럼 남들이 못 뽑는 한국어 데이터를 매달 정제해 CSV/JSON/API 로 납품합니다. 구축 100~300만원 + 월정액 30~80만원.',
        eyebrow: '서비스 · 데이터 피드',
        h1: '데이터 피드 — 필요한 데이터를 매달 정제해서 납품합니다',
        sub: '공공 공고·HWP 첨부·PDF 표처럼 남들이 못 뽑는 한국어 데이터가 전문입니다.',
        price: '구축 100~300만원 + 월 30~80만원',
        offer: { minPrice: 300000, maxPrice: 800000, unitCode: 'MON', unitText: '월정액(구축비 별도)' },
        priceNote: '처음 한 번 세팅하는 비용과, 이후 매달 데이터가 끊기지 않고 오는 비용입니다.',
        whoH: '이런 팀을 위해',
        who: [
          '매주 사람이 복사해 넣는 팀',
          'HWP·PDF 안의 표가 필요한 팀',
          '검색·RAG·분석용 외부 데이터를 지속 공급받아야 하는 팀',
        ],
        howH: '진행',
        how: [
          { name: '구축 — 100~300만원', text: '대상 분석, 수집 규칙, 스키마 확정, 과거분 백필, 검증, 납품 경로. 대상 수·첨부 파싱·백필 기간에 따라 정해집니다.' },
          { name: '월정액 — 월 30~80만원', text: '정해진 주기로 수집, 사이트 변경 시 복구, 갱신 로그.' },
        ],
        toolLine: proof.tool,
        deliverH: '결과물',
        deliverables: [
          'CSV / JSON / API — 스키마 고정',
          '갱신 로그 — 시각·신규·변경·삭제',
          '실패·복구 이력',
        ],
        optionH: '',
        options: [],
        // 근거는 히어로 아래 두 줄(2026-09-06): 이 방식으로 실제로 한 것 → 만든 것들.
        heroProof: [
          '나라장터 개찰 데이터 6개월분을 이 방식으로 수집·파싱·집계했습니다 — 협상에 의한 계약 응찰 73,373건·업체 13,220곳.',
          proof.careerShort + ' — 그 엔지니어가 직접 합니다.',
        ],
        heroProofLink: { label: '만든 것들', href: '/work/#pipeline' },
        notesH: '실측 노트',
        notes: [
          { label: '표가 사라지면 RAG 는 틀린 숫자를 자신 있게 말한다 — 공고문 214건으로 잰 HWP·PDF 표 추출', href: '/notes/korean-tables/', line: '범용 추출은 셀 85% 를 버리거나 행 구조 4% 만 남긴다. 같은 문서의 PDF 는 최선 도구도 셀 87%.' },
          // 개찰 데이터 관측은 독자가 입찰 업체라 미리보아에 일회성 리포트로 올렸다(09-06 결정). 여기선 링크만 —
          // 이 피드가 매달 내는 표의 실물(관측치 + 데이터의 사정)이라는 뜻에서.
          { label: '이 피드가 낸 표의 실물 — 나라장터 개찰 데이터 6개월 관측 (미리보아 리포트)', href: 'https://miriboa.sizlon.io/reports/2026-h1-bid-opening/', line: '응찰 1,747만 행·공고 183,240건. 관측치 셋과, 숫자 옆에 같이 나가는 데이터의 사정 셋(빈 날·수집 시점·미확정).' },
        ],
        principlesH: '데이터 수집 원칙',
        principles: [
          '로그인 뒤의 데이터, 개인정보, 약관상 수집 금지 사이트, 저작권 있는 본문 전문은 금액과 무관하게 받지 않습니다.',
          'robots 와 요청 간격을 준수합니다.',
          '고객 데이터를 재판매하거나 다른 고객에게 재사용하지 않습니다.',
          '납품 표에는 빈 날과 그 사유, 미확정 비율, 수집 기준일을 숫자와 같은 표에 적습니다. 고지가 빠진 표는 틀린 표보다 위험합니다.',
        ],
        minLine: '일회성 추출 50만원 미만은 받지 않습니다.',
        faqH: '자주 묻는 것',
        faq: [
          { q: '자체 서버로 옮길 수 있나요?', a: '운영 실적이 쌓인 피드에 한해 별도 견적으로 안내합니다.' },
          { q: '대상 사이트가 바뀌면요?', a: '복구는 월정액에 포함됩니다.' },
          { q: '주기는 어떻게 정하나요?', a: '구축 단계에서 대상과 함께 확정합니다.' },
        ],
        crossLine: '',
        crossHref: '',
        cta: '받고 싶은 데이터와 출처 URL 만 알려주시면 하루 안에 구축비·월정액 견적을 드립니다',
      },
    },

    // ── 만든 것들 (v3 §3.5) ────────────────────────────────────────────
    work: {
      title: '만든 것들',
      description: '시즐론 명의로 만들고 실제로 쓰이는 것 — 미리보아(입찰 서류 검증), 나라장터 개찰 데이터 파이프라인.',
      eyebrow: '만든 것들',
      h1: '시즐론 명의로 만들고, 실제로 쓰이는 것만.',
      lede: '서비스 페이지의 근거는 전부 여기 있는 것들에서 나옵니다.',
      items: [
        {
          id: 'miriboa',
          name: '미리보아',
          tag: '입찰 서류 검증 · miriboa.sizlon.io',
          body: '나라장터·미 연방조달 공고에서 요구조건을 전부 뽑아 응찰 서류가 각 항목에 응답했는지 대조하는 서비스입니다. HWP·PDF 문서 파이프라인, 요구조건 추출·대조 엔진, 항목마다 붙는 원문 근거, 공개 벤치마크로 이루어져 있습니다. 감리 대응 RTM 은 이 엔진으로 합니다.',
          proves: ['문서 파이프라인', '요구조건 추출·대조', '근거 인용', '공개 벤치마크'],
          links: [
            { label: '미리보아 열기', href: 'https://miriboa.sizlon.io/' },
            { label: '골든 벤치마크 — 측정 방법·실패 사례·한계', href: 'https://miriboa.sizlon.io/benchmark/' },
          ],
          evidenceFor: 'rtm',
        },
        {
          id: 'pipeline',
          name: '나라장터 개찰 데이터 파이프라인',
          tag: '공공 데이터 수집 · 첨부 파싱 · 집계',
          body: 'API 수집, HWP/PDF 첨부 파싱, 정제·집계로 이루어진 파이프라인입니다. 6개월분 개찰 자료에서 협상에 의한 계약 응찰 73,373건·업체 13,220곳을 집계했고, 그 결과가 탈락 사유 리포트입니다. 데이터 피드는 이 파이프라인으로 합니다.',
          proves: ['공공 데이터 지속 수집', '첨부 파싱', '집계'],
          links: [
            { label: '2026 상반기 탈락 리포트', href: 'https://miriboa.sizlon.io/reports/2026-h1-disqualification/' },
          ],
          evidenceFor: 'data',
        },
      ],
      provesLabel: '증명하는 것',
      evidenceLabel: '근거가 되는 서비스',
    },

    // ── 회사 소개 (v3 §3.6) ────────────────────────────────────────────
    about: {
      title: '회사 소개',
      description: '주식회사 시즐론 — 대표 이광연. 매체 7,000곳·일 20만 건 수집·색인 인프라를 구축·운영한 검색 엔지니어가 검색 품질 진단, 공공 SI 감리 대응 문서, 월정액 데이터 피드를 직접 수행합니다.',
      eyebrow: '회사 소개',
      h1: '1인 기업입니다. 대표가 직접 수행합니다.',
      lede: '시즐론은 서울 용산의 소프트웨어 회사입니다. 견적을 내는 사람, 코드를 쓰는 사람, 결과물을 넘기는 사람이 한 사람입니다.',
      sections: [
        { h: '무엇을 하는가 (시즐론, 2026.4~)', p: ['검색 품질 진단(Elasticsearch·OpenSearch), 공공 SI 감리 대응 문서, 월정액 데이터 피드를 합니다. 같은 엔진으로 미리보아를 운영합니다. 미디어비에서 쓰던 설계로 자동 복구 크롤러를 시즐론에서 재구축했습니다.'] },
        { h: '작업 방식', p: [method] },
        { h: '왜 1인인가', p: ['NDA 아래 받은 자료를 보는 사람이 한 사람이라는 뜻이고, 품질을 설명할 수 있는 사람이 만든 사람과 같다는 뜻입니다.'] },
        { h: '대표 이광연', p: [proof.careerShort + '. 소프트웨어 엔지니어 20년.'] },
      ],
      founderCta: '대표 소개 보기',
      factsTitle: '회사 정보',
      facts: [
        { k: '법인명', v: '주식회사 시즐론 (Sizlon Inc.)' },
        { k: '대표', v: '이광연' },
        { k: '사업자등록번호', v: '420-86-03864' },
        { k: '주소', v: '서울특별시 용산구 원효로 189-7, 302호' },
        { k: '전화', v: '02-702-5795 — 평일 09:00–18:00' },
        { k: '이메일', v: 'hello@sizlon.io' },
      ],
      cta: '20분 통화 예약',
    },

    // ── 대표 소개 (/founder, 2026-09-06) — 이름 검색에 걸리는 페이지. 회사 소개와 분리.
    //    출처는 이력서(2026-09-03 판)만. 개인 연락처·월 단위 재직기간·입학연도는 쓰지 않는다.
    founder: {
      title: '이광연 — 시즐론 대표',
      description: '시즐론 대표 이광연. 소프트웨어 엔지니어 20년. 코리아뉴스와이어 수석 엔지니어(2013~2025)로 매체 7,000곳·일 20만 건 수집·색인 인프라를 구축·운영. Elasticsearch 아키텍처, Nori·Mecab 커스터마이징, 자동 사전 갱신, 크롤링 플랫폼.',
      eyebrow: '대표 소개',
      h1: '이광연',
      lede: '소프트웨어 엔지니어 20년. 대규모 뉴스·미디어 데이터의 수집, 검색엔진 색인, 검색 품질 개선, 운영까지 한 파이프라인을 처음부터 끝까지 설계하고 굴려 왔습니다. 지금은 그 일을 시즐론에서 서비스로 합니다.',
      sections: [
        {
          h: '경력',
          p: [],
          list: [
            '시즐론 대표 (2026~) — 검색 품질 진단 · 감리 대응 RTM · 데이터 피드. 미리보아와 나라장터 개찰 데이터 파이프라인을 만들고 운영',
            '코리아뉴스와이어 수석 엔지니어 (2013~2025) — 언론 모니터링 서비스 미디어비의 데이터 마이닝·정제·검색·관리 시스템 구축',
            '위키넷 웹개발 팀장 (2011~2013) — 비즈니스 SNS 링크나우 개발·운영, Sphinx 검색 인덱싱 튜닝',
            '오리엔트웹 시스템 관리 팀장 (2005~2006) — 호스팅 웹시스템·멀티 도메인 웹메일 구축',
            '그 앞 5년은 서버 호스팅·서버 기술영업',
          ],
        },
        {
          h: '검색엔진',
          p: ['Elasticsearch 기반 대규모 검색 시스템의 아키텍처를 설계하고 운영했습니다.'],
          list: [
            'Index 템플릿 · Component 템플릿 설계와 적용',
            '커스텀 토크나이저 개발, Nori · Mecab 형태소 분석기 커스터마이징',
            '신규 단어 추출과 형태소 분석으로 사용자 사전을 자동 갱신하는 프로그램',
            '대용량 인덱스의 월별 분할, 기간별 자동 스냅샷 정책',
            'DB 와 인덱스를 대조하는 동기화 검사 자동화',
            'script · aggregation 을 포함한 Query DSL 고급 활용, 역할 구성',
          ],
        },
        {
          h: '데이터 파이프라인',
          p: [],
          list: [
            '매체 7,000여 곳을 패턴 분석해 크롤링 인스턴스를 생성하는 플랫폼 구축',
            '추출 → 정제 → DB 저장 → 색인까지 지연 없이 이어지는 자동 파이프라인, 일평균 신규 기사 20만 건',
            '매체별 수집 주기와 직전 종료 시각을 반영한 인스턴스 관리, Grafana 모니터링',
            'Python · scrapy · playwright · MariaDB · Elasticsearch',
          ],
        },
        {
          h: '운영 환경',
          p: ['온프레미스, Docker Compose, Kubernetes 세 환경에서 같은 시스템을 운영했습니다. GitLab CI/CD, PostgreSQL 설계, 데이터 정합성 검사 자동화.'],
          list: [],
        },
        {
          h: '학력',
          p: ['고려대학교 물리학'],
          list: [],
        },
      ],
      workLine: '만든 것들은 따로 정리해 두었습니다.',
      workLink: '만든 것들 보기',
      cta: '20분 통화 예약',
    },

    // ── 증거 글 공통 문구 (/notes/*, 2026-09-06) ────────────────────────
    notes: {
      byline: '시즐론 이광연',
      tailLine: '이 절차를 고객 코퍼스에 적용하는 서비스:',
    },

    // ── 문의 (v3 §3.7) ─────────────────────────────────────────────────
    contact: {
      title: '문의',
      description: '시즐론 문의 — 전화 02-702-5795(평일 09–18), 20분 통화 예약, 또는 아래 폼. 검색 진단·감리 대응·데이터 피드.',
      eyebrow: '문의',
      h1: '전화가 가장 빠릅니다.',
      phoneLabel: '평일 09:00–18:00',
      phoneMissed: '부재중이면 예약 링크를 문자로 보내드립니다.',
      bookLead: '통화 시간을 미리 잡으시려면',
      book: '20분 통화 예약',
      formH: '폼으로 남기기',
      labels: { name: '회사 / 담당자', email: '이메일', phone: '전화번호 (선택)', service: '서비스', message: '요청 내용 (선택)' },
      servicePlaceholder: '서비스 선택',
      // 키 이름은 `topics` 여야 한다 — sizlon-platform tests/test_contact_topics.py 가 이
      // 파일에서 `topics: {…}` 를 읽어 백엔드 TOPIC_LABELS 와 대조한다(주제 유실 가드).
      topics: { search: '검색 품질 진단', rtm: '감리 대응 RTM', datafeed: '데이터 피드', other: '기타' },
      messageDefault: '통화 요청',
      submit: '보내기',
      note: '영업일 1일 내 회신',
      sending: '보내는 중…',
      sentTitle: '접수됐습니다.',
      sentBody: '영업일 1일 내에 회신드립니다. 급하시면 02-702-5795 로 전화 주세요.',
      verifyNeeded: '인증을 완료한 뒤 다시 시도해 주세요.',
      sendError: '전송 중 문제가 발생했습니다. 잠시 후 다시 시도하시거나, 전화 또는 이메일로 연락 주세요.',
      altPrefix: '이메일',
    },

    notFound: {
      title: '페이지를 찾을 수 없습니다',
      description: 'sizlon.io에 해당 페이지가 없습니다.',
      h1: '이 페이지는 없습니다.',
      body: '링크가 오래되었거나 페이지가 옮겨졌을 수 있습니다. 홈에서 다시 시작하시거나, 무엇을 찾으셨는지 알려주세요.',
      home: '홈으로',
      contact: '문의하기',
      miriboaNote: '미리보아 입찰 서비스를 찾으셨다면 여기입니다 —',
    },

    // ── 법적 고지 — 2026-07-29 판 유지, 09-06 에 세 곳만 손봄: 수집 항목에
    //    전화번호(선택) 추가, 제품 제공 방식·라이선스 문단은 그대로(사실 변경 없음),
    //    데이터 수집 원칙은 /services/data#principles 를 고정 URL 로 참조. ────
    legal: {
      updatedLabel: '최종 수정',
      updated: '2026-09-06',
      terms: {
        title: '이용약관',
        description: 'Sizlon 웹사이트 이용에 관한 약관.',
        lede: '본 약관은 본 웹사이트(sizlon.io) 이용과 이를 통한 정보 요청에 적용됩니다. 시즐론이 수행하는 서비스(검색 품질 진단·감리 대응 문서·데이터 피드)는 견적서와 개별 계약이, Sizlon 제품의 사용은 각 납품 시 제공되는 별도 라이선스 계약이 규율합니다.',
        sections: [
          { h: '운영자', p: ['본 웹사이트는 주식회사 시즐론이 운영합니다 — 대표: 이광연 · 사업자등록번호 420-86-03864 · 전화 02-702-5795 · 서울특별시 용산구 원효로 189-7, 302호 · hello@sizlon.io.'] },
          { h: '동의', p: ['sizlon.io에 접속함으로써 귀하는 본 약관에 동의합니다. 조직을 대신해 사이트를 이용하는 경우 해당 조직을 대신하여 동의하는 것으로 봅니다.', '동의하지 않으시면 사이트를 이용하지 마십시오.'] },
          { h: '서비스와 제품의 제공 방식', p: ['시즐론의 서비스 — 검색 품질 진단, 감리 대응 요구사항 추적표, 데이터 피드 —는 통화로 범위를 정한 뒤 견적서와 개별 계약(NDA 포함)에 따라 수행합니다. 본 사이트의 가격은 범위 확정 전 기준가이며, 견적서가 우선합니다. 데이터 피드의 수집 원칙은 /services/data#principles 에 게시하며 견적서·계약서가 이를 참조합니다.', '시즐론이 소프트웨어를 납품하는 경우, 그 소프트웨어는 판매가 아니라 라이선스로 제공되며, 오프라인으로 검증되는 벤더 발급 라이선스로 납품됩니다. 온라인 서비스 — 미리보아 —는 Sizlon이 자체 주소에서 운영하며, 해당 사이트에서 계정을 만들고 그 사이트에 게시된 약관에 따라 이용하십니다. 어느 경우든 본 웹사이트 내용과 상충하면 계약, 라이선스 또는 해당 서비스 약관이 우선합니다.'] },
          { h: '미리보아는 별도 약관이 적용됩니다', p: ['미리보아는 miriboa.sizlon.io에서 별도 서비스로 운영됩니다. 계정, 가격, 결제, 청약철회, 전달, 제출 서류의 취급은 모두 해당 사이트에 게시된 이용약관이 정하며, 본 페이지가 정하지 않습니다. 두 문서가 다른 경우 서비스에 관하여는 미리보아 약관이 우선합니다.'] },
          { h: '웹사이트 이용', p: ['정당한 업무 목적으로 본 사이트를 열람·공유할 수 있습니다. 서비스 방해, 무단 접근 시도, 서비스 품질을 저하시키는 대규모 스크래핑 등 오용은 금지됩니다.', '본 사이트의 모든 콘텐츠·표장·디자인은 Sizlon 또는 그 라이선서에게 귀속되며, 허가 없이 상업적으로 복제할 수 없습니다.'] },
          { h: '제출 정보', p: ['문의할 때 귀하는 정확한 정보를 제공하는 데 동의합니다. 제출한 내용은 개인정보처리방침에 따라 처리됩니다.'] },
          { h: '보증의 부인', p: ['본 웹사이트와 그 콘텐츠는 어떠한 종류의 보증도 없이 "있는 그대로" 제공됩니다. 성능 수치·벤치마크·경력 서술은 정보 제공용이며 귀하 환경에서의 결과를 보장하지 않습니다. 개별 서비스의 보장 조건은 견적서·계약서가 정합니다.'] },
          { h: '책임의 제한', p: ['관련 법이 허용하는 최대 범위에서, Sizlon은 본 웹사이트 이용으로 발생하는 간접·부수적·결과적 손해에 대해 책임지지 않습니다.', '관련 법상 배제하거나 제한할 수 없는 책임은 본 조항으로 배제·제한되지 않습니다.'] },
          { h: '준거법 및 관할', p: ['본 약관은 대한민국 법을 준거법으로 하며, 국제사법 원칙은 적용하지 않습니다. 본 약관 또는 본 웹사이트 이용과 관련하여 분쟁이 발생하는 경우, 서울중앙지방법원을 제1심 전속 관할 법원으로 합니다.'] },
          { h: '변경', p: ['본 약관은 수시로 개정될 수 있습니다. 현행 버전은 항상 본 페이지에 게시된 것이며, 상단에 날짜가 표시됩니다.'] },
          { h: '문의', p: ['본 약관 관련 문의: hello@sizlon.io.'] },
        ],
      },
      privacy: {
        title: '개인정보처리방침',
        description: 'Sizlon이 웹사이트를 통해 수집하는 개인정보 처리 방침.',
        lede: '본 방침은 Sizlon이 회사 사이트를 통해 수집하는 개인정보와 그 이용 방법을 설명합니다. 미리보아 서비스(miriboa.sizlon.io)는 자체 방침이 적용되며, 서비스 수행 중 고객이 제공하는 자료는 개별 계약(NDA)이 정합니다 — 아래 "적용 범위"와 "서비스·제품 데이터" 참조.',
        sections: [
          { h: '적용 범위', p: ['본 방침은 시즐론 회사 사이트(sizlon.io) 및 이를 통해 접수되는 업무 문의에 적용됩니다. 본 사이트에는 가입도 결제도 없습니다 — 계정, 공고 알림, 참가자격 사전판정, 입찰서류 검증은 모두 별도 서비스인 미리보아(miriboa.sizlon.io)에서 운영되며, 해당 서비스가 수집하는 개인정보는 그 사이트의 개인정보처리방침이 정합니다.', '라이선스된 Sizlon 제품 내부에서 귀하가 처리하는 데이터에도 적용되지 않으며, 해당 데이터는 귀하의 환경에서 처리됩니다.'] },
          { h: '수집 항목', p: ['문의 양식 이용 시 귀하가 제공하는 정보 — 회사·담당자명, 이메일, 전화번호(선택), 관심 서비스, 요청 내용 —를 수집합니다. 전화로 문의하시는 경우 통화 중 알려주신 회사·담당자명·연락처를 후속 연락을 위해 기록합니다.', '본 사이트는 정적 페이지로 제공되며 광고 추적기를 사용하지 않고, 자체 쿠키를 설정하지 않습니다. 호스팅 제공자는 보안·안정성을 위해 표준 서버 로그를 보관할 수 있습니다. 문의 양식은 스팸 차단을 위해 Cloudflare Turnstile을 사용합니다 — Cloudflare가 사람인지 확인하는 가벼운 챌린지를 수행하며, 이를 사이트 간 추적에 사용하지 않습니다.', '사이트 이용 현황 파악을 위해 최소한의 쿠키 없는 방문 통계를 Sizlon 자체 서버에 보관합니다: 페이지 경로, 페이지 언어, 유입 경로(리퍼러), 스크롤 깊이, 체류 시간. 이 기록에는 이름·계정·쿠키가 포함되지 않고, IP 주소는 저장하지 않으며 — 방문 집계는 매일 바뀌어 날짜를 넘어 연결할 수 없는 해시로만 수행합니다 — “Do Not Track”을 설정한 브라우저는 수집에서 제외됩니다.'] },
          { h: '이용 목적', p: ['수집한 정보는 문의 응대, 요청하신 정보 제공, 견적·업무 관련 후속 연락에 사용합니다. 개인정보를 판매하지 않습니다.'] },
          { h: '서비스·제품 데이터', p: ['서비스 수행 중 고객이 제공하는 자료(로그·설정·RFP·산출물·수집 대상 목록 등)는 요청하신 업무에만 사용하고 제3자와 공유하지 않으며, 계약이 정한 기간(기본 15일) 안에 파기합니다. 데이터 피드로 수집한 데이터는 해당 고객에게만 납품하고 재판매·재사용하지 않습니다.', '라이선스된 Sizlon 소프트웨어는 귀하의 통제 하에 온프레미스 또는 연결형으로 배포됩니다 — 추출·처리되는 데이터는 귀하 환경에 머물며, Sizlon은 지원 업무상 명시적으로 필요하고 귀하가 승인한 경우를 제외하고 접근하지 않습니다.', '미리보아처럼 Sizlon이 운영하는 온라인 서비스의 경우, 보내주신 서류는 요청하신 검증 수행에만 사용하고 제3자와 공유하지 않으며, 해당 서비스의 개인정보처리방침이 정하는 바에 따라 보관·삭제합니다.'] },
          { h: '처리 위탁 및 국외 이전', p: ['사이트 운영과 문의 처리를 위해 소수의 서비스 제공자를 이용하며, 이들의 서버는 대한민국 외(주로 미국)에 위치할 수 있습니다. GitHub, Inc. — 웹사이트 호스팅(GitHub Pages, 표준 서버 로그). 문의 양식 접수 내용과 방문 통계는 Sizlon 자체 서버에 보관됩니다. Google LLC — 신규 문의 알림 메일 전달(Gmail). Cloudflare, Inc. — Turnstile 스팸 방지.', '각 제공자는 해당 서비스 제공 목적으로만 개인정보를 처리하며 자체 개인정보 보호 약정의 적용을 받습니다. 이들 외의 제3자에게는 법률상 요구되는 경우를 제외하고 개인정보를 제공하지 않습니다.'] },
          { h: '보유 기간', p: ['문의 관련 개인정보는 접수일로부터 최대 3년간 보관한 뒤 지체 없이 파기합니다. 방문 통계에는 개인 식별정보가 포함되지 않으며 집계 형태로 보관합니다. 전자적 파일은 복구할 수 없는 방법으로 삭제합니다.'] },
          { h: '보안', p: ['보유 정보를 보호하기 위해 합리적인 기술적·관리적 조치를 적용합니다. 다만 어떠한 전송·저장 방식도 완전히 안전하지는 않습니다.'] },
          { h: '정보주체의 권리', p: ['관련 법 — 대한민국 개인정보 보호법(PIPA) 포함 —에 따라 귀하는 개인정보의 열람·정정·삭제를 요청할 수 있습니다. 권리 행사는 hello@sizlon.io로 요청하시면 지체 없이 처리합니다.'] },
          { h: '개인정보 보호책임자', p: ['개인정보 보호책임자: 이광연(대표이사) · hello@sizlon.io — 개인정보 관련 문의·불만·피해구제 요청을 처리합니다.', '해결되지 않는 사안은 개인정보분쟁조정위원회(www.kopico.go.kr · 1833-6972) 또는 KISA 개인정보침해 신고센터(privacy.kisa.or.kr · 국번 없이 118)에 도움을 요청하실 수 있습니다.'] },
          { h: '변경', p: ['본 방침은 개정될 수 있으며, 중요한 변경은 시행 최소 7일 전에 본 페이지를 통해 공지합니다. 현행 버전은 상단 날짜가 표시된 본 페이지의 내용입니다.'] },
          { h: '문의', p: ['개인정보 관련 문의·요청: hello@sizlon.io.'] },
        ],
      },
      licenses: {
        title: '라이선스 & 고지',
        description: '시즐론의 서비스 결과물 귀속, 소프트웨어 라이선스 모델, 제3자 고지.',
        lede: '시즐론의 서비스 결과물은 계약이 정한 대로 고객에게 귀속합니다. 소프트웨어를 납품하는 경우 판매가 아니라 라이선스로 제공하고, 미리보아는 시즐론이 직접 운영하는 온라인 서비스로 제공합니다. 본 페이지는 그 모델과 웹사이트의 제3자 고지를 요약합니다.',
        sections: [
          { h: '서비스 결과물', p: ['검색 품질 진단·감리 대응·데이터 피드의 결과물(보고서, 설정 파일, 추적표, 납품 데이터)에 대한 권리는 견적서·계약서가 정합니다. 별도 정함이 없으면 대금 완납 시 고객에게 귀속하고, 시즐론은 결과물을 다른 고객에게 재사용하지 않습니다.'] },
          { h: '소프트웨어 라이선스·온라인 서비스', p: ['시즐론이 소프트웨어를 납품하는 경우, 그 소프트웨어는 판매가 아니라 라이선스로 제공되는 독점 소프트웨어입니다. 오프라인으로 검증되는 벤더 발급 라이선스로 납품되며, 소스 은닉 형태로 제공됩니다.', '미리보아는 Sizlon이 miriboa.sizlon.io에서 운영하는 온라인 서비스로 제공됩니다: 계정을 통해 서류 패키지를 보내주시면 Sizlon 자체 환경에서 검증을 수행하고 결과 리포트를 돌려드립니다. 설치용 소프트웨어를 납품하거나 라이선스하지 않으며, 리포트에 대한 권리와 서류의 취급은 해당 사이트에 게시된 약관이 정합니다.', '관련 법이 명시적으로 허용하는 범위를 제외하고, 납품된 소프트웨어의 재배포·재실시·역공학·소스 추출 시도는 금지됩니다. 전체 조건은 납품 또는 업무 개시 시 제공되는 계약에 있습니다.'] },
          { h: '오픈소스 구성요소', p: ['시즐론이 납품하는 소프트웨어와 운영하는 서비스는 각기 고유 라이선스를 가진 제3자 오픈소스 구성요소를 포함합니다. 소프트웨어 납품 시에는 해당 구성요소와 라이선스를 나열한 전체 저작자 표시·NOTICE 파일이 함께 갑니다.'] },
          { h: '본 웹사이트', p: ['본 사이트는 Astro(MIT 라이선스)로 제작되었으며, 오픈소스 서체 Bricolage Grotesque·Hanken Grotesk·JetBrains Mono·Pretendard를 각 오픈소스 라이선스에 따라 사용합니다.'] },
          { h: '상표', p: ['"Sizlon", "Crawler Platform", "미리보아(Miriboa)"는 Sizlon의 상표입니다. 기타 명칭은 각 소유자의 상표일 수 있습니다.'] },
          { h: '문의', p: ['라이선스 관련 문의: hello@sizlon.io.'] },
        ],
      },
    },
  },

  // ── 영어: /en/ 한 장(v3 §3.8, Upwork 용) + 크롬 라벨 ────────────────────
  en: {
    proof,
    common: {
      menu: 'Menu',
      skip: 'Skip to content',
      call: 'Call',
      book: 'Book a 20-minute call',
      hours: 'Weekdays 09–18 KST',
      email: 'Email',
      langSwitch: 'KO',
      koreanSite: 'Korean site',
      legalNote: 'Legal (Korean)',
      vatNote: 'Prices exclude VAT.',
      fixedLine: 'Fixed price · deliverables named up front · done by the founder',
    },
    nav: { search: 'Search diagnostics', rtm: 'Audit RTM', data: 'Data feeds', work: 'Work', about: 'About', contact: 'Contact', founder: 'Founder' },
    footer: {
      tagline: 'AI proposes. A deterministic layer verifies.',
      services: 'Services',
      work: 'Work',
      company: 'Company',
      legal: 'Legal',
      principles: 'Data collection principles',
      workItems: [
        { href: '/work/#miriboa', label: 'Miriboa' },
        { href: '/work/#pipeline', label: 'Bid-opening data pipeline' },
      ],
      baseline: 'Fixed price · deliverables named up front · done by the founder',
      business: 'Sizlon Inc. (주식회사 시즐론) · CEO Kwangyeon Lee · Biz. Reg. 420-86-03864 · Tel: +82-2-702-5795 · 302, 189-7 Wonhyo-ro, Yongsan-gu, Seoul, Republic of Korea · hello@sizlon.io',
    },
    legalNav: { Terms: 'Terms', Privacy: 'Privacy', Licenses: 'Licenses' },
    // ── 증거 글 공통 문구 (/en/notes/*, 2026-09-06) ─────────────────────
    notes: {
      byline: 'Kwangyeon Lee, Sizlon',
      tailLine: 'Want this run on your corpus? Email',
    },

    notFound: {
      title: 'Page not found',
      description: 'That page does not exist on sizlon.io.',
      h1: 'That page isn’t here.',
      body: 'The link may be out of date, or the page may have moved. Start from the home page, or tell us what you were looking for.',
      home: 'Go to the home page',
      contact: 'Contact us',
      miriboaNote: 'Looking for the Miriboa bid service? It lives at',
    },
    page: {
      title: 'Korean search, RAG retrieval & data extraction',
      description: 'Korean search, RAG retrieval and data extraction — from someone who ran it in production: 7,000 news sources, ~200K new articles a day. Nori, CJK tokenizers, user dictionaries, hybrid BM25 + kNN, HWP/PDF extraction, self-healing crawlers.',
      eyebrow: 'Sizlon · Seoul',
      h1: 'Korean search, RAG retrieval & data extraction — from someone who ran it in production',
      lede: proof.en + '.',
      blocks: [
        {
          h: 'Korean web, HWP & PDF extraction',
          p: 'Korean public-sector data lives in HWP attachments and PDF tables that generic tooling drops silently. I extract them with tables intact, deliver CSV/JSON/API on a fixed schema, and run the source on a self-healing crawler that recovers when a page changes instead of quietly stopping. API first when one exists.',
        },
        {
          h: 'Korean search that actually retrieves',
          p: 'Nori and other CJK tokenizers, user dictionaries, synonym sets, analyzer design for Elasticsearch and OpenSearch. Most "our RAG answers are off" problems are retrieval problems, and most Korean retrieval problems start at the tokenizer.',
        },
        {
          h: 'Hybrid retrieval',
          p: 'BM25 + kNN, fused and evaluated against a frozen golden set of failing queries — before/after measured, not asserted.',
        },
      ],
      backgroundH: 'Background',
      background: 'Twenty years as a software engineer. At Korea Newswire (2013–2025, principal engineer) I designed and ran the Elasticsearch architecture behind a media-monitoring service: index and component templates, a custom tokenizer, Nori and Mecab customisation, automatic user-dictionary updates from new-term extraction, monthly index rollover with snapshot policies, and DB-to-index consistency checks. The ingestion side was a crawling platform generating per-source instances for about 7,000 news sources, ~200K new articles a day, on Python, scrapy and playwright, run on-prem, on Docker Compose and on Kubernetes.',
      caseH: 'Case studies',
      // 영문 노트 목록(/en/notes/*). 비어 있으면 En.astro 가 절을 렌더하지 않는다.
      cases: [
        { title: 'Why Korean RAG fails: start with the tokenizer', href: '/en/notes/korean-tokenizer/' },
        { title: 'When the table disappears, RAG states a wrong number with confidence', href: '/en/notes/korean-tables/' },
      ],
      miriboaLine: 'Miriboa — a bid-document verification service I build and run: requirement extraction and matching over Korean and U.S. federal tenders, with a published benchmark.',
      miriboaHref: 'https://miriboa.sizlon.io/en/',
      upworkLabel: 'Upwork profile',
      contactLine: 'Email hello@sizlon.io or use the Korean site’s contact form — English is fine.',
    },
  },
} as const;

export type Lang = keyof typeof content;
export type ServiceKey = keyof typeof content.ko.services;
