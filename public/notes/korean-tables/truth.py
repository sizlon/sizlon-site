"""정답(ground truth) 표 추출 — 추출기와 독립된 경로로 표의 셀을 읽는다.
hwpx: zip 안 Contents/section*.xml 의 <hp:tbl> 을 직접 파싱(추출기 무관).
hwp : pyhwp 의 hwp5html 로 HTML 변환 뒤 <table> 파싱(제3자 구조 파서).
반환: [{'rows': [[cell,...],...]}, ...]  (셀은 공백 정규화한 텍스트)
"""
import re, sys, zipfile, subprocess, html, os
import xml.etree.ElementTree as ET
HP='{http://www.hancom.co.kr/hwpml/2011/paragraph}'
def _norm(s): return re.sub(r'\s+',' ',s or '').strip()
def hwpx_tables(path):
    tables=[]
    with zipfile.ZipFile(path) as z:
        secs=sorted(n for n in z.namelist() if re.match(r'Contents/section\d+\.xml',n))
        for n in secs:
            root=ET.fromstring(z.read(n))
            for tbl in root.iter(HP+'tbl'):
                rows={}
                for tc in tbl.iter(HP+'tc'):
                    addr=tc.find(HP+'cellAddr'); r=int(addr.get('rowAddr')); c=int(addr.get('colAddr'))
                    txt=_norm(' '.join(t.text or '' for t in tc.iter(HP+'t')))
                    rows.setdefault(r,{})[c]=txt
                grid=[[rows[r].get(c,'') for c in sorted(rows[r])] for r in sorted(rows)]
                if grid: tables.append({'rows':grid})
    return tables
def hwp_tables(path, hwp5html='hwp5html'):
    out=subprocess.run([hwp5html,'--html',path],capture_output=True,text=True,timeout=300).stdout
    tables=[]
    for tb in re.findall(r'<table.*?</table>',out,flags=re.S):
        grid=[]
        for tr in re.findall(r'<tr.*?</tr>',tb,flags=re.S):
            cells=[_norm(html.unescape(re.sub(r'<[^>]+>',' ',td))) for td in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>',tr,flags=re.S)]
            if cells: grid.append(cells)
        if grid: tables.append({'rows':grid})
    return tables
def sniff(path):
    """확장자가 아니라 첫 바이트로 형식을 정한다 — 나라장터 첨부에는 .hwpx 이름의 HWP 바이너리 같은 것이 섞여 있다."""
    with open(path,'rb') as f: m=f.read(4)
    return {b'\xd0\xcf\x11\xe0':'hwp', b'PK\x03\x04':'hwpx', b'%PDF':'pdf'}.get(m)
def tables_for(path, hwp5html='hwp5html'):
    kind=sniff(path)
    if kind=='hwpx': return hwpx_tables(path)
    if kind=='hwp': return hwp_tables(path, hwp5html)
    raise ValueError(f'unknown format (magic) for {os.path.basename(path)}')
if __name__=='__main__':
    for p in sys.argv[1:]:
        ts=tables_for(p, os.environ.get('HWP5HTML','hwp5html'))
        cells=sum(len(r) for t in ts for r in t['rows']); nonempty=sum(1 for t in ts for r in t['rows'] for c in r if c)
        print(f'{os.path.basename(p)[:40]:40s} tables={len(ts):3d} rows={sum(len(t["rows"]) for t in ts):4d} cells={cells:5d} nonempty={nonempty:5d}')
        if ts: print('   e.g.', ts[min(1,len(ts)-1)]['rows'][:2])
