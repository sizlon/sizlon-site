"""채점. 정답 표(truth.py) 대비 추출 텍스트가 셀·행·항목-숫자 짝을 얼마나 지키는가.
  cell_retention : 정답 셀(2자 이상, 공백 제거) 중 출력 텍스트(공백 제거)에 등장하는 비율
  row_integrity  : 비어 있지 않은 셀이 2개 이상인 정답 행 중, 그 셀들이 출력의 같은 줄(±0)에 모두 있는 행의 비율
  kv_association : 정답 행 중 '한글 라벨 셀 + 숫자 셀' 이 있는 행에서, 라벨과 숫자가 출력의 같은 줄에 있는 비율
                   (평가항목↔배점, 서류↔부수, 항목↔금액 — 표가 없으면 못 답하는 질문의 대리 지표)
사용: python3 score.py <문서 목록 파일 또는 경로들> --out results.json
"""
import re, os, sys, json, argparse, time
sys.stdout.reconfigure(line_buffering=True)   # 리다이렉트해도 문서마다 한 줄씩 바로 찍히게
import truth, extractors
nz = lambda s: re.sub(r'\s+', '', s or '')
def cells_rows(tables):
    cells = set(); rows = []; kv = []
    for t in tables:
        for r in t['rows']:
            ne = [c for c in r if nz(c) and len(nz(c)) >= 2]
            for c in ne: cells.add(nz(c))
            if len(ne) >= 2: rows.append([nz(c) for c in ne])
            labels = [c for c in r if re.search(r'[가-힣]', c) and not re.search(r'\d', c) and len(nz(c)) >= 2]
            nums = [c for c in r if re.fullmatch(r'[\d,.\s%점원억만천]+', c.strip()) and re.search(r'\d', c)]
            if labels and nums: kv.append((nz(labels[0]), nz(nums[0])))
    return cells, rows, kv
def score_text(text, cells, rows, kv):
    flat = nz(text); lines = [nz(l) for l in text.splitlines() if nz(l)]
    cr = sum(1 for c in cells if c in flat) / len(cells) if cells else None
    ri = sum(1 for r in rows if any(all(c in l for c in r) for l in lines)) / len(rows) if rows else None
    ka = sum(1 for a, b in kv if any(a in l and b in l for l in lines)) / len(kv) if kv else None
    return {'cell_retention': cr, 'row_integrity': ri, 'kv_association': ka, 'n_cells': len(cells), 'n_rows': len(rows), 'n_kv': len(kv), 'chars': len(text)}
if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('paths', nargs='+'); ap.add_argument('--out', default='results.json'); ap.add_argument('--truth-for', default=None, help='pdf 의 정답으로 쓸 hwp/hwpx 경로 매핑 json {pdf: hwpx}')
    a = ap.parse_args()
    # 경로 규약: 'LOCAL:' 접두어는 ~/Projects/miriboa/ (표준계약서·인권위 시험셋), 상대 경로는 현재 디렉터리 기준(corpus_g2b/…)
    LOCAL = os.path.expanduser(os.environ.get('LOCAL_DOCS_ROOT', '~/Projects/miriboa/'))
    resolve = lambda x: x.replace('LOCAL:', LOCAL) if x.startswith('LOCAL:') else x
    paths = []
    for p in a.paths:
        if os.path.isfile(p) and not p.lower().endswith(('.hwp', '.hwpx', '.pdf')): paths += [resolve(l.strip()) for l in open(p) if l.strip()]
        else: paths.append(resolve(p))
    pair = {resolve(k): resolve(v) for k, v in json.load(open(a.truth_for)).items()} if a.truth_for else {}
    res = []
    for p in paths:
        kind = truth.sniff(p)
        if not kind: print('skip (unknown format by magic)', os.path.basename(p)); continue
        ext = '.' + kind                                   # 확장자가 아니라 실제 형식으로 채점
        tpath = pair.get(p, p) if ext == '.pdf' else p
        try: tables = truth.tables_for(tpath, os.environ.get('HWP5HTML', 'hwp5html'))
        except Exception as e: print('truth failed', p, e); continue
        cells, rows, kv = cells_rows(tables)
        row = {'doc': os.path.basename(p), 'format': ext[1:], 'declared_ext': os.path.splitext(p)[1].lower()[1:], 'truth_from': os.path.basename(tpath), 'n_tables': len(tables), 'scores': {}}
        for name in extractors.BY_FORMAT[ext]:
            t0 = time.time()
            try: text, meta = extractors.run(name, p)
            except Exception as e: row['scores'][name] = {'error': str(e)[:120]}; continue
            s = score_text(text, cells, rows, kv); s['seconds'] = round(time.time() - t0, 1); s.update({f'meta_{k}': v for k, v in meta.items()}); row['scores'][name] = s
        res.append(row)
        print(f"{row['doc'][:34]:34s} {ext[1:]:4s} tables={len(tables):3d} cells={len(cells):4d} rows={len(rows):3d} kv={len(kv):3d} | " + ' '.join(f"{n}:{(s.get('cell_retention') if s.get('cell_retention') is not None else -1):.2f}/{(s.get('row_integrity') if s.get('row_integrity') is not None else -1):.2f}/{(s.get('kv_association') if s.get('kv_association') is not None else -1):.2f}" for n, s in row['scores'].items()))
    json.dump(res, open(a.out, 'w'), ensure_ascii=False, indent=0)
    print(f'\nwrote {a.out} ({len(res)} docs)')
