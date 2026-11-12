"""키워드 엑셀 → data/site-pages.json (사이트 라우트의 단일 출처) + keywords/강철스카이_페이지.xlsx

  python -I scripts/regions_src.py   # 먼저 (지역 데이터)
  python -I scripts/build_pages.py

원본: keywords/강철스카이_키워드.xlsx '키워드' 시트 (region_kw_prj 에서 복사, 5,107행)
'생성 대상' 열이 페이지 여부를 정한다.
  O        → 기본 페이지. 엑셀 순서(순번) 그대로 4묶음(누적 25→50→75→100%, rebatch --plan 과 같은 방식)
  5, 6 …   → 오픈 뒤 추가 묶음(extra). 그 숫자가 곧 wave. data/drip.json 의 extra 에 날짜를 넣는다.
  빈칸      → 페이지 안 만듦
"""
import json, sys
from collections import Counter
from pathlib import Path
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / 'drip'))
from rebatch import rebatch  # noqa: E402

ROOT = HERE.parent
SRC = ROOT / 'keywords' / '강철스카이_키워드.xlsx'
OUT_XLSX = ROOT / 'keywords' / '강철스카이_페이지.xlsx'
SITE_URL = 'http://127.0.0.1:18991'  # 도메인 확정 후 lib/site.ts 와 같이 바꾼다

# 엑셀 '단어' → 조합기(lib/compose.ts EQ) 키
EQ = {'스카이': 'sky', '스카이차': 'sky', '스카이차량': 'sky', '고소작업차': 'aerial',
      '1톤 스카이': 'ton', '3.5톤 스카이': 'ton', '5톤 스카이': 'ton', '스카이 임대': 'rent', '스카이 대여': 'rent'}

regions = json.load(open(ROOT / 'data' / 'regions.json', encoding='utf-8'))['regions']
base, extra = [], []
for r in list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))[1:]:
    n, kw, prio, target, _req, label, parent, unit, word, mod, alt, slug = r[:12]
    if not kw or not target:
        continue
    assert label in regions, f'지역 데이터 없음: {label} ({kw})'
    assert word in EQ, word
    pg = dict(n=n, kw=kw, slug=slug or kw.replace(' ', '-'), label=label, unit=unit, word=word, eq=EQ[word], mod=mod or '',
              prio=prio, alt=alt or '', gu=regions[label]['gu'], city=regions[label]['city'])
    t = str(target).strip()
    if t.upper() == 'O':
        base.append(pg)
    else:
        assert t.isdigit() and int(t) >= 5, f'생성 대상 값은 O 또는 5 이상 숫자: {t} ({kw})'
        pg['wave'] = int(t); extra.append(pg)

base.sort(key=lambda p: p['n'])  # 엑셀 순서 = 우선순위 순
for i, p in enumerate(base, 1):
    p['no'] = i; p['wave'] = 1
rebatch(base, plan=[25, 50, 75, 100])
for i, p in enumerate(sorted(extra, key=lambda p: (p['wave'], p['n'])), len(base) + 1):
    p['no'] = i
pages = base + sorted(extra, key=lambda p: p['no'])
assert all(v == 1 for v in Counter(p['slug'] for p in pages).values()), '슬러그 중복'
json.dump({'pages': pages}, open(ROOT / 'data' / 'site-pages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

# ---- 페이지 엑셀 (첫 시트 = 키워드 시트, 요약 시트 없음). 위에서부터 N개 = 페이지 순서 ----
wb = Workbook(); ws = wb.active; ws.title = '키워드'
ws.append(['순서', '순번(원본)', '키워드', '우선순위', '지역', '상위지역', '지역단위', '단어', '수식어', 'URL', '오픈 묶음'])
for p in pages:
    ws.append([p['no'], p['n'], p['kw'], p['prio'], p['label'], regions[p['label']]['parent'] or '', p['unit'], p['word'], p['mod'],
               f"{SITE_URL}/{p['slug']}/", p['wave']])
for c in ws[1]:
    c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='17181A'); c.alignment = Alignment(horizontal='center')
for col, w in zip('ABCDEFGHIJK', [6, 9, 32, 8, 18, 9, 9, 12, 8, 60, 9]):
    ws.column_dimensions[col].width = w
ws.freeze_panes = 'A2'; ws.auto_filter.ref = f'A1:K{len(pages) + 1}'
wb.save(OUT_XLSX)

sys.stdout.reconfigure(encoding='utf-8')
c = Counter(p['wave'] for p in pages); acc = 0
for w in sorted(c):
    acc += c[w]
    print(f'묶음 {w}: {c[w]} (누적 {acc}) {dict(Counter(p["unit"] for p in pages if p["wave"] == w))}')
print('엑셀:', OUT_XLSX.name, len(pages), '행')
