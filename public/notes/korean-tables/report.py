"""results.json 집계 — 포맷×추출기별 micro 평균(셀·행·짝을 문서 가중 없이 합산), 문서 수, 실패(0.5 미만) 건수.
사용: python3 report.py results.json [results2.json ...]
"""
import json, sys, collections
rows = []
for f in sys.argv[1:]: rows += json.load(open(f, encoding='utf8'))
agg = collections.defaultdict(lambda: {'docs': 0, 'cells': 0, 'cells_hit': 0.0, 'rows': 0, 'rows_hit': 0.0, 'kv': 0, 'kv_hit': 0.0, 'err': 0, 'loss_flag': 0, 'sec': 0.0})
for r in rows:
    for name, s in r['scores'].items():
        g = agg[(r['format'], name)]
        if 'error' in s: g['err'] += 1; continue
        g['docs'] += 1; g['sec'] += s.get('seconds', 0)
        for k in ('cells', 'rows', 'kv'):
            n = s[f'n_{k}']; v = s[{'cells': 'cell_retention', 'rows': 'row_integrity', 'kv': 'kv_association'}[k]]
            if n and v is not None: g[k] += n; g[f'{k}_hit'] += v * n
        if s.get('meta_table_loss'): g['loss_flag'] += 1
print(f"{'format':6s} {'extractor':17s} {'docs':>4s} {'cells':>6s} {'cell_ret':>8s} {'rows':>5s} {'row_int':>7s} {'kv':>4s} {'kv_assoc':>8s} {'err':>3s} {'s/doc':>5s}")
for (fmt, name), g in sorted(agg.items()):
    f = lambda h, n: f'{h/n:.3f}' if n else '   -'
    print(f"{fmt:6s} {name:17s} {g['docs']:4d} {g['cells']:6d} {f(g['cells_hit'], g['cells']):>8s} {g['rows']:5d} {f(g['rows_hit'], g['rows']):>7s} {g['kv']:4d} {f(g['kv_hit'], g['kv']):>8s} {g['err']:3d} {g['sec']/max(g['docs'],1):5.1f}")
