"""수선 전후 비교 — 같은 docs.txt 로 만든 두 results 를 위치로 맞춰 dpurix 열의 지표 차이를 낸다.
사용: python3 compare_before_after.py results.json results_after.json [--extractor dpurix]
"""
import json, sys, argparse, collections
ap = argparse.ArgumentParser(); ap.add_argument('before'); ap.add_argument('after'); ap.add_argument('--extractor', default='dpurix'); a = ap.parse_args()
A = json.load(open(a.before, encoding='utf8')); B = json.load(open(a.after, encoding='utf8')); assert len(A) == len(B)
def micro(rows):
    g = collections.defaultdict(lambda: [0, 0.0, 0, 0.0, 0, 0.0, 0])
    for r in rows:
        s = r['scores'].get(a.extractor, {});
        if 'error' in s or not s: continue
        x = g[r['format']]; x[6] += 1
        for i, (n, v) in enumerate((('n_cells', 'cell_retention'), ('n_rows', 'row_integrity'), ('n_kv', 'kv_association'))):
            if s[n] and s[v] is not None: x[2*i] += s[n]; x[2*i+1] += s[v] * s[n]
    return {f: (x[1]/x[0] if x[0] else None, x[3]/x[2] if x[2] else None, x[5]/x[4] if x[4] else None, x[6]) for f, x in g.items()}
ma, mb = micro(A), micro(B)
print(f"{'format':6s} {'docs':>4s}  {'cell_ret':>17s}  {'row_int':>17s}  {'kv_assoc':>17s}")
for f in sorted(ma):
    fmt = lambda p, q: f"{(p if p is not None else 0):.3f} → {(q if q is not None else 0):.3f}"
    print(f"{f:6s} {ma[f][3]:4d}  {fmt(ma[f][0], mb[f][0]):>17s}  {fmt(ma[f][1], mb[f][1]):>17s}  {fmt(ma[f][2], mb[f][2]):>17s}")
print('\nper-document moves (cell_retention changed ≥ 0.05):')
for x, y in zip(A, B):
    sa, sb = x['scores'].get(a.extractor, {}), y['scores'].get(a.extractor, {})
    ca, cb = sa.get('cell_retention'), sb.get('cell_retention')
    if ca is None or cb is None: continue
    if abs(ca - cb) >= 0.05: print(f"  {x['doc'][:44]:44s} {x['format']:4s} cell {ca:.2f}→{cb:.2f}  row {(sa.get('row_integrity') or 0):.2f}→{(sb.get('row_integrity') or 0):.2f}  kv {(sa.get('kv_association') or 0):.2f}→{(sb.get('kv_association') or 0):.2f}")
