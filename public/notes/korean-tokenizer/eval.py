"""평가: python3 eval.py base mixed tuned2 tuned2s
정답 판정은 자동 두 기준 — strict(공백 제거 제목이 질의를 연속 부분문자열로 포함), loose(질의 어절 각각 포함).
이 파일은 strict 만 계산한다; loose 는 results.json 에 함께 들어 있다(같은 함수에 rel_loose 를 넣으면 된다).
tuned2s 인덱스 설정: body=analyzer_settings('mixed', user_rules=rules); analysis.tokenizer.ko_tok_search =
  {'type':'nori_tokenizer','decompound_mode':'none','user_dictionary_rules':rules};
  analysis.analyzer.ko_search = {'type':'custom','tokenizer':'ko_tok_search','filter':['nori_readingform','lowercase','nori_part_of_speech']};
  mappings.properties.title.search_analyzer='ko_search'
"""
import json, re, sys, collections
from common import *
norm=lambda s: re.sub(r'\s+','',s).lower()
QUERIES=json.load(open('queries.json'))
DOCS={d['id']:d['title'] for d in docs()}
NORM={i:norm(t) for i,t in DOCS.items()}
def relevant(q):
    nq=norm(q); return {i for i,t in NORM.items() if nq in t}
def evaluate(index, operator='or'):
    rows=[]
    for qq in QUERIES:
        q=qq['q']; rel=relevant(q)
        hits=search(index,q,size=50,operator=operator); ids=[h[0] for h in hits]
        top10=ids[:10]; top50=ids[:50]
        p10=sum(1 for i in top10 if i in rel)/10
        r50=(sum(1 for i in top50 if i in rel)/min(len(rel),50)) if rel else None
        rr=0.0
        for k,i in enumerate(ids,1):
            if i in rel: rr=1/k; break
        rows.append({'q':q,'grp':qq['grp'],'rel':len(rel),'hits':len(hits),'p10':p10,'r50':r50,'rr':rr,'top3':[h[1] for h in hits[:3]]})
    return rows
if __name__=='__main__':
    indices=sys.argv[1:]
    out={}
    for ix in indices:
        rows=evaluate(ix); out[ix]=rows
        by=collections.defaultdict(list)
        for r in rows: by[r['grp']].append(r); by['ALL'].append(r)
        print(f'== {ix}')
        for g in ['lossy','inconsistent','control','ALL']:
            rs=by[g]; n=len(rs)
            p10=sum(r['p10'] for r in rs)/n; r50=sum(r['r50'] or 0 for r in rs)/n; mrr=sum(r['rr'] for r in rs)/n
            zero=sum(1 for r in rs if r['p10']==0)
            print(f'  {g:13s} n={n:2d}  P@10={p10:.3f}  R@50={r50:.3f}  MRR={mrr:.3f}  zero-in-top10={zero}')
    json.dump(out, open('results.json','w'), ensure_ascii=False, indent=0)
    # per-query table for the first vs last index
    a,b=indices[0],indices[-1]
    print(f'\n== per query: {a} → {b}  (P@10 / R@50)')
    for ra,rb in zip(out[a],out[b]):
        flag='' if abs(ra['p10']-rb['p10'])<1e-9 else ('▲' if rb['p10']>ra['p10'] else '▼')
        print(f"{ra['q']:12s} {ra['grp']:12s} rel={ra['rel']:5d}  {ra['p10']:.1f}/{(ra['r50'] or 0):.2f} → {rb['p10']:.1f}/{(rb['r50'] or 0):.2f} {flag}")
