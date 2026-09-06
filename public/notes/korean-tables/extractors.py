"""비교 대상 추출기들. 모두 (path) -> text.  '흔히 쓰는 방법' 셋 + 배포 체인(parse-web) 하나.
- hwp5txt   : pyhwp 의 hwp5txt (HWP 5.0 텍스트 추출기)
- hwp_naive : GitHub 에 흔한 방식 — olefile 로 BodyText/Section* 을 열어 zlib 해제 후 문단 텍스트 레코드만 긁기
- hwpx_strip: HWPX(zip) 의 section XML 에서 태그를 걷어낸 것
- pdftotext / pdftotext_layout / pymupdf / pdfplumber / pdfplumber_tables : PDF 추출기 다섯(마지막은 표 인식 켠 것)
- dpurix    : 배포 체인 parse-web /api/parse (표는 [BEGIN TABLE] … 셀|셀 … [END TABLE])
"""
import os, re, io, zlib, struct, zipfile, subprocess, json, html
import olefile, requests

def hwp5txt(path, bin_='hwp5txt'):
    return subprocess.run([bin_, path], capture_output=True, text=True, timeout=300).stdout

def hwp_naive(path):
    ole = olefile.OleFileIO(path)
    hdr = ole.openstream('FileHeader').read(); compressed = bool(hdr[36] & 1)
    out = []
    for entry in sorted(e for e in ole.listdir() if e[0] == 'BodyText'):
        data = ole.openstream(entry).read()
        if compressed: data = zlib.decompress(data, -15)
        i = 0
        while i + 4 <= len(data):
            h = struct.unpack('<I', data[i:i+4])[0]; tag = h & 0x3ff; size = (h >> 20) & 0xfff; i += 4
            if size == 0xfff: size = struct.unpack('<I', data[i:i+4])[0]; i += 4
            if tag == 67:  # HWPTAG_PARA_TEXT
                txt = data[i:i+size].decode('utf-16le', errors='ignore')
                txt = ''.join(ch if (ord(ch) >= 32 and ord(ch) not in range(0xe000, 0xf8ff)) else ' ' for ch in txt)
                out.append(txt)
            i += size
    return '\n'.join(out)

def hwpx_strip(path):
    parts = []
    with zipfile.ZipFile(path) as z:
        for n in sorted(x for x in z.namelist() if re.match(r'Contents/section\d+\.xml', x)):
            s = z.read(n).decode('utf8', errors='ignore')
            s = re.sub(r'</hp:p>', '\n', s); s = re.sub(r'<[^>]+>', ' ', s)
            parts.append(html.unescape(s))
    return '\n'.join(parts)

def pdftotext(path): return subprocess.run(['pdftotext', path, '-'], capture_output=True, text=True, timeout=300).stdout
def pdftotext_layout(path): return subprocess.run(['pdftotext', '-layout', path, '-'], capture_output=True, text=True, timeout=300).stdout
def pymupdf(path):
    import pymupdf; return '\n'.join(p.get_text() for p in pymupdf.open(path))
def pdfplumber_(path):
    import pdfplumber
    with pdfplumber.open(path) as pdf: return '\n'.join((p.extract_text() or '') for p in pdf.pages)
def pdfplumber_tables(path):
    # 표 인식을 켠 pdfplumber — 흔히 쓰는 '표 대응' 범용 경로. 본문 텍스트 + 인식된 표를 행마다 '셀 | 셀' 로.
    import pdfplumber; out = []
    with pdfplumber.open(path) as pdf:
        for p in pdf.pages:
            out.append(p.extract_text() or '')
            for t in (p.extract_tables() or []):
                out += [' | '.join((c or '').replace('\n', ' ') for c in row) for row in t]
    return '\n'.join(out)

def dpurix(path, base=None):
    base = base or os.environ.get('PARSE_WEB') or _parse_web_base()
    with open(path, 'rb') as f:
        r = requests.post(f'{base}/api/parse', files={'file': (os.path.basename(path), f)}, timeout=600)
    r.raise_for_status(); d = r.json()
    return d.get('text', ''), {k: d.get(k) for k in ('status', 'extractor', 'table_loss', 'note')}

def _parse_web_base():
    ip = subprocess.run(['docker', 'inspect', '-f', '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}', 'sizlon-dev-dpurix-parse-1'], capture_output=True, text=True).stdout.strip()
    return f'http://{ip}:8979'

BY_FORMAT = {
    '.hwp':  ['hwp5txt', 'hwp_naive', 'dpurix'],
    '.hwpx': ['hwpx_strip', 'dpurix'],
    '.pdf':  ['pdftotext', 'pdftotext_layout', 'pymupdf', 'pdfplumber', 'pdfplumber_tables', 'dpurix'],
}
def run(name, path):
    if name == 'dpurix': return dpurix(path)
    fn = {'hwp5txt': lambda p: hwp5txt(p, os.environ.get('HWP5TXT', 'hwp5txt')), 'hwp_naive': hwp_naive, 'hwpx_strip': hwpx_strip,
          'pdftotext': pdftotext, 'pdftotext_layout': pdftotext_layout, 'pymupdf': pymupdf, 'pdfplumber': pdfplumber_, 'pdfplumber_tables': pdfplumber_tables}[name]
    return fn(path), {}
