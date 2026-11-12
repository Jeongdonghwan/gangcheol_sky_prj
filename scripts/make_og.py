"""페이지별 og 이미지(1200x630 JPEG) → public/og/<key>.jpg  (home, area, blog, area-<허브>, <키워드 슬러그>, blog-<글 슬러그>)
   python -I scripts/make_og.py           # 없는 것만 생성
   python -I scripts/make_og.py --force   # 전부 다시
왼쪽 검정 판 + 오른쪽 실차 사진(원본 크기 이하로 배치 — 늘리지 않음). 네이버는 og 를 가운데 정사각형으로 잘라 보여 주므로
제목은 가운데 630px 안쪽(285~915)에 둔다.
"""
import datetime, json, os, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'og'
W, H = 1200, 630
SAFE_L, SAFE_W = 300, 600
BRAND, PHONE = '강철스카이', '010-5575-8225'  # lib/site.ts 와 맞출 것
INK, OR = (17, 18, 20), (255, 90, 10)
_FONTS = [(r'C:\Windows\Fonts\malgunbd.ttf', r'C:\Windows\Fonts\malgun.ttf'),
          ('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'),
          ('/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc', '/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc')]
BOLD, REG = next((f for f in _FONTS if Path(f[0]).exists()), _FONTS[0])
PH = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']


def fnv(s):  # lib/data.ts hash 와 같은 FNV-1a
    h = 2166136261
    for ch in s:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return h


def base(pid):
    im = Image.new('RGB', (W, H), INK)
    ph = Image.open(ROOT / 'public' / 'img' / f'{pid}.jpg').convert('RGB')  # 500x560 → 높이 630 에 맞춰 살짝만 키움(1.125배)
    ph = ph.resize((round(ph.width * H / ph.height), H), Image.LANCZOS)
    im.paste(ph, (W - ph.width, 0))
    shade = Image.new('RGB', (ph.width, H), INK)
    im.paste(Image.blend(im.crop((W - ph.width, 0, W, H)), shade, 0.45), (W - ph.width, 0))
    return im


def wrap(d, text, font, maxw):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    return lines + [cur] if cur else lines


def render(bases, key, title, sub):
    im = bases[PH[fnv(key) % len(PH)]].copy()
    d = ImageDraw.Draw(im)
    size = 76
    while True:
        f = ImageFont.truetype(BOLD, size)
        lines = wrap(d, title, f, SAFE_W)
        if (len(lines) <= 3 and all(d.textlength(x, font=f) <= SAFE_W for x in lines)) or size <= 40:
            break
        size -= 4
    y = 300 - len(lines) * size * 0.62
    d.rectangle((SAFE_L, y - 36, SAFE_L + 80, y - 26), fill=OR)
    for ln in lines:
        d.text((SAFE_L, y), ln, font=f, fill='white'); y += size * 1.2
    d.text((SAFE_L, y + 14), sub, font=ImageFont.truetype(REG, 28), fill=(205, 208, 212))
    d.text((SAFE_L, 536), f'{BRAND}  {PHONE}', font=ImageFont.truetype(BOLD, 30), fill=OR)
    im.save(OUT / f'{key}.jpg', 'JPEG', quality=80, optimize=True, progressive=True)


def blog_posts():  # lib/blog.ts 와 같은 규칙: '_' 시작 제외, date(없으면 publishedAt)가 비었거나 빌드일보다 미래면 제외
    today = os.environ.get('BUILD_DATE') or (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=9)).strftime('%Y-%m-%d')
    out = []
    for f in sorted((ROOT / 'content' / 'blog').glob('[!_]*.md')):
        head = f.read_text(encoding='utf-8').split('\n---', 1)[0]
        meta = dict(re.findall(r'^(\w+):[ \t]*(.*?)[ \t]*$', head, re.M))
        date = meta.get('date') or meta.get('publishedAt') or ''
        if meta.get('slug') and meta.get('title') and re.fullmatch(r'\d{4}-\d{2}-\d{2}', date) and date <= today:
            out.append((meta['slug'], meta['title'].strip('\'"')))
    return out


def main():
    force = '--force' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    pages = json.loads((ROOT / 'data' / 'site-pages.json').read_text(encoding='utf-8'))['pages']
    regions = json.loads((ROOT / 'data' / 'regions.json').read_text(encoding='utf-8'))['regions']
    hubs = sorted({p['gu'] for p in pages})
    jobs = [('home', '인천·김포·부천 스카이차 임대·작업', '외벽 · 간판 · 유리·샷시 · 실리콘 · 자재 운반'),
            ('area', '지역별 스카이차 안내', '인천 10개 군·구 · 김포 · 부천'),
            ('blog', '스카이차·고소작업 궁금증', '현장에서 자주 받는 질문')] + \
           [(f'area-{h}', f"{regions[h]['name']} 스카이차 안내", '임대 · 대여 · 작업 · 출장') for h in hubs] + \
           [(p['slug'], p['kw'], '기사 동행 바스켓 작업 · 24시간 상담') for p in pages] + \
           [(f'blog-{s}', t, '스카이차·고소작업 블로그') for s, t in blog_posts()]
    jobs = [j for j in jobs if force or not (OUT / f'{j[0]}.jpg').exists()]
    bases = {pid: base(pid) for pid in PH} if jobs else {}
    for i, (key, title, sub) in enumerate(jobs, 1):
        render(bases, key, title, sub)
        if i % 500 == 0:
            print(i, '/', len(jobs))
    print('생성', len(jobs))


if __name__ == '__main__':
    assert fnv('a') == 0xE40C292C
    main()
