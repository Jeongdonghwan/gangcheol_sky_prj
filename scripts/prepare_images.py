"""홈페이지 실차 사진 → public/img/*.webp(+ og 배경용 .jpg) + data/photos.json

  python -I scripts/prepare_images.py

쓰는 사진 (source/facts.md 사진 표)
  p1~p7  = raw/11~17 작업사진 게시판 원본(500×560). 늘리지 않고 원본 크기 그대로 저장.
  c1~c4  = 인사말(raw/29)·영업안내(raw/33) 통 이미지 안 실차 사진을 잘라낸 것(차체에 강철스카이 번호 표기).
  쓰지 않는 것: raw/10 합성 포스터, 배너·템플릿·아이콘.
캡션은 사진에 보이는 것만 적는다(장소·톤수·높이는 사진으로 알 수 없어 적지 않음).
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'source' / 'raw'
OUT = ROOT / 'public' / 'img'

PHOTOS = [
    ('p1', '11_', None, '주차 빌딩 앞에서 아웃트리거를 내리고 붐을 올린 스카이차'),
    ('p2', '12_', None, '곡선형 주차 빌딩 외벽 쪽으로 붐을 뻗은 스카이차'),
    ('p3', '13_', None, '유리 외벽 고층 건물 앞에서 바스켓을 높이 올린 작업'),
    ('p4', '14_', None, '새 건물 외벽 판넬 앞에 차를 세우고 붐을 세운 작업'),
    ('p5', '15_', None, '아파트 단지 안 주차장에서 고층 외벽으로 붐을 올린 스카이차'),
    ('p6', '16_', None, '비계가 둘러진 고층 건물 외벽 앞 스카이차'),
    ('p7', '17_', None, '상가 골목에 차를 세우고 건물 외벽으로 붐을 뻗은 작업'),
    ('c1', '29_', (42, 1123, 652, 1445), '차체에 강철스카이 번호가 적힌 스카이차 옆모습'),
    ('c2', '29_', (657, 1123, 960, 1445), '아파트 단지 주차장에 들어간 스카이차'),
    ('c3', '33_', (550, 752, 980, 1167), '유리 외벽 고층 건물 앞에 붐을 세운 스카이차'),
    ('c4', '33_', (548, 1172, 980, 1435), '저층 건물 옆에서 붐을 옆으로 길게 뻗은 스카이차'),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    meta = []
    for pid, prefix, box, cap in PHOTOS:
        src = next(RAW.glob(prefix + '*.png'))
        im = Image.open(src).convert('RGB')
        if box:
            im = im.crop(box)
        im.save(OUT / f'{pid}.webp', 'WEBP', quality=84, method=6)
        im.save(OUT / f'{pid}.jpg', 'JPEG', quality=86)
        meta.append(dict(id=pid, w=im.width, h=im.height, caption=cap, src=src.name))
    json.dump({'photos': meta}, open(ROOT / 'data' / 'photos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('photos', len(meta), [(m['id'], m['w'], m['h']) for m in meta])
    icons()


def icons():
    """파비콘 — 검정 사각 + 주황 붐(사선) + 바스켓(ㅁ 윗변 없음). 로고 마크(.logo-mark)와 같은 글리프"""
    from PIL import ImageDraw
    S = 512
    im = Image.new('RGB', (S, S), (17, 18, 20))
    d = ImageDraw.Draw(im)
    OR = (255, 90, 10)
    d.line([(96, 410), (330, 190)], fill=OR, width=56)                       # 붐
    d.line([(318, 112), (318, 214), (436, 214), (436, 112)], fill=OR, width=34, joint='curve')  # 바스켓
    d.rectangle((70, 400, 200, 440), fill=OR)                                 # 차체 받침
    im.save(ROOT / 'app' / 'icon.png')
    im.resize((180, 180), Image.LANCZOS).save(ROOT / 'app' / 'apple-icon.png')
    im.save(ROOT / 'public' / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == '__main__':
    main()
