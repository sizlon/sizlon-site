"""같은 문서 47쌍(원본 hwp/hwpx vs PDF) 문서 평균 — 경로로 짝을 맞춘다(이름 중복 무관).
사용: python3 paired_stats.py results.json [results_after.json ...]
"""
import json, sys, os
docs=[l.strip() for l in open('docs.txt') if l.strip()]; pairs=json.load(open('pairs.json')); idx={p:i for i,p in enumerate(docs)}
mean=lambda v: (lambda w: sum(w)/len(w) if w else 0.0)([x for x in v if x is not None])
for f in sys.argv[1:]:
    res=json.load(open(f)); assert len(res)==len(docs)
    rows=[(res[idx[t]],res[idx[p]]) for p,t in pairs.items() if p in idx and t in idx]
    K=['cell_retention','row_integrity','kv_association']
    print(f'== {f}: {len(rows)} pairs (doc-mean cell / row / kv)')
    print('   original hwp/hwpx, dpurix   ', ' '.join(f"{mean([a['scores']['dpurix'].get(k) for a,b in rows]):.3f}" for k in K))
    for n in ['dpurix','pdftotext','pdftotext_layout','pdfplumber_tables','pymupdf']:
        print(f'   pdf twin, {n:18s}', ' '.join(f"{mean([b['scores'].get(n,{}).get(k) for a,b in rows]):.3f}" for k in K))
    print('   pdf twin, best tool per doc, cell: %.3f'%mean([max((b['scores'].get(n,{}).get('cell_retention') or 0) for n in ['pdftotext','pdftotext_layout','pdfplumber','pdfplumber_tables','pymupdf','dpurix']) for a,b in rows]))
