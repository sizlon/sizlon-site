"""나라장터 첨부 코퍼스 수집. 개찰 코퍼스(corpus.jsonl)에서 용역·경쟁입찰 공고를 무작위로 뽑아
입찰공고정보서비스(getBidPblancListInfoServc, inqryDiv=2 공고번호 조회)로 첨부 URL 을 받고 .hwp/.hwpx/.pdf 를 내려받는다.
API 가 간헐적으로 멈추므로(2026-09 실측: 1초 응답과 90초 무응답이 섞임) 타임아웃 20초 × 3회 재시도.
사용: G2B_SERVICE_KEY=… python3 fetch_g2b.py --n 60 --out corpus_g2b [--seed 11]
출력: corpus_g2b/<공고번호>/<파일>, corpus_g2b/manifest.json (공고·첨부·pair 정보)
"""
import os, sys, json, random, argparse, time, re, hashlib
import requests
sys.stdout.reconfigure(line_buffering=True)
API = 'http://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoServc'
def api(key, no, tries=3, timeout=20):
    for i in range(tries):
        try:
            r = requests.get(API, params={'serviceKey': key, 'numOfRows': 10, 'pageNo': 1, 'type': 'json', 'inqryDiv': 2, 'bidNtceNo': no}, timeout=timeout)
            r.raise_for_status(); items = r.json()['response']['body'].get('items') or []
            return items
        except Exception as e:
            last = e; time.sleep(2)
    print(f'  {no}: API failed after {tries} tries ({type(last).__name__})'); return None
def safe(name): return re.sub(r'[\\/:*?"<>|]+', '_', name)[:120]
if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--n', type=int, default=60); ap.add_argument('--out', default='corpus_g2b'); ap.add_argument('--seed', type=int, default=11)
    ap.add_argument('--corpus', default=os.path.expanduser('~/Projects/docs/tokenizer-experiment-2026-09/corpus.jsonl')); ap.add_argument('--since', default='2026-05-01'); ap.add_argument('--timeout', type=int, default=10); ap.add_argument('--tries', type=int, default=4)
    a = ap.parse_args(); key = os.environ['G2B_SERVICE_KEY']
    docs = [json.loads(l) for l in open(a.corpus, encoding='utf8')]
    pool = [d for d in docs if d['div'] == '용역' and d['method'] in ('일반경쟁', '제한경쟁') and d['date'] >= a.since]
    random.seed(a.seed); random.shuffle(pool)
    os.makedirs(a.out, exist_ok=True); man = []; got = 0
    for d in pool:
        if got >= a.n: break
        items = api(key, d['id'], tries=a.tries, timeout=a.timeout)
        if not items: continue
        it = max(items, key=lambda x: x.get('bidNtceOrd', '000'))   # 최신 차수
        atts = [(it.get(f'ntceSpecFileNm{i}'), it.get(f'ntceSpecDocUrl{i}')) for i in range(1, 11) if it.get(f'ntceSpecDocUrl{i}')]
        keep = [(n, u) for n, u in atts if n and n.lower().endswith(('.hwp', '.hwpx', '.pdf'))]
        if not keep: continue
        ddir = os.path.join(a.out, d['id']); os.makedirs(ddir, exist_ok=True); files = []
        for n, u in keep:
            p = os.path.join(ddir, safe(n))
            try:
                r = requests.get(u, timeout=60); r.raise_for_status(); open(p, 'wb').write(r.content)
                files.append({'name': n, 'path': p, 'bytes': len(r.content), 'sha256': hashlib.sha256(r.content).hexdigest()[:16]})
            except Exception as e: print(f'  download failed {n}: {e}')
        if files:
            got += 1; man.append({'id': d['id'], 'title': it.get('bidNtceNm'), 'agency': it.get('ntceInsttNm'), 'files': files})
            print(f'[{got}/{a.n}] {d["id"]} {it.get("bidNtceNm","")[:30]} → {[f["name"][-12:] for f in files]}')
            json.dump(man, open(os.path.join(a.out, 'manifest.json'), 'w'), ensure_ascii=False, indent=0)
    print('done', got, 'notices,', sum(len(m['files']) for m in man), 'files')
