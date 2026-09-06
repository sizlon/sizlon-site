"""병렬 수집기 출력(corpus_g2b*, 각각 manifest.json)을 하나의 corpus_g2b/manifest.json 으로 합친다(공고번호 중복 제거).
사용: python3 merge_corpora.py corpus_g2b corpus_g2b_12 corpus_g2b_13 ... --out corpus_g2b_all
"""
import os, sys, json, shutil, argparse
ap = argparse.ArgumentParser(); ap.add_argument('dirs', nargs='+'); ap.add_argument('--out', default='corpus_g2b_all'); a = ap.parse_args()
os.makedirs(a.out, exist_ok=True); seen = set(); man = []
for d in a.dirs:
    p = os.path.join(d, 'manifest.json')
    if not os.path.exists(p): continue
    for m in json.load(open(p, encoding='utf8')):
        if m['id'] in seen: continue
        seen.add(m['id']); dst = os.path.join(a.out, m['id']); os.makedirs(dst, exist_ok=True); files = []
        for f in m['files']:
            if not os.path.exists(f['path']): continue
            np = os.path.join(dst, os.path.basename(f['path'])); shutil.copy2(f['path'], np); files.append({**f, 'path': np})
        if files: man.append({**m, 'files': files})
json.dump(man, open(os.path.join(a.out, 'manifest.json'), 'w'), ensure_ascii=False, indent=0)
print('merged', len(man), 'notices', sum(len(m['files']) for m in man), 'files →', a.out)
