"""오픈일이 정해지면 블로그 초안(date 비어 있음)에 공개일을 채운다 — 오픈일부터 하루 1·2편 번갈아(30일 45편).

  python -I scripts/drip/schedule_posts.py 2026-12-01          # 채우기 + 큐 done 처리 + data/drip.json launch 기록
  python -I scripts/drip/schedule_posts.py 2026-12-01 --dry    # 날짜 배정만 출력
  python -I scripts/drip/schedule_posts.py                      # 자체 점검(demo)

- 순서 = content/blog/_data/keywordQueue.json 순서(큐에 없는 글은 파일명 순으로 뒤에).
- 이미 date 가 있는 글은 건드리지 않는다. 배정 규칙은 drip_status.py 의 postsPerDay 1.5 와 같다(1,2,1,2…).
- date 와 publishedAt 을 같은 날로 채운다. lib/blog.ts 는 빌드일(KST) 이후 날짜의 글을 숨기므로 날짜가 되면 저절로 공개된다.
"""
import datetime as dt, json, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / 'content' / 'blog'
QUEUE = BLOG / '_data' / 'keywordQueue.json'
DRIP = ROOT / 'data' / 'drip.json'


def dates(start, n, per_day=1.5):
    out, k = [], 0
    while len(out) < n:
        out += [start + dt.timedelta(k)] * (math.floor((k + 1) * per_day) - math.floor(k * per_day)); k += 1
    return out[:n]


def demo():
    d = dates(dt.date(2026, 12, 1), 45)
    assert d[0] == dt.date(2026, 12, 1) and d[1] == d[2] == dt.date(2026, 12, 2) and d[3] == dt.date(2026, 12, 3)
    assert d[-1] == dt.date(2026, 12, 30) and len(set(d)) == 30
    s = 'slug: a\ndate:\npublishedAt:\n'
    assert set_date(s, '2026-12-01') == 'slug: a\ndate: 2026-12-01\npublishedAt: 2026-12-01\n'
    print('demo ok')


def set_date(text, day):
    text = re.sub(r'^date:[ \t]*$', f'date: {day}', text, count=1, flags=re.M)
    return re.sub(r'^publishedAt:[ \t]*$', f'publishedAt: {day}', text, count=1, flags=re.M)


def meta_of(text):
    head = text.split('\n---', 1)[0]
    return dict(re.findall(r'^(\w+):[ \t]*(.*?)[ \t]*$', head, re.M))


def main(start, dry):
    q = json.loads(QUEUE.read_text(encoding='utf-8'))
    order = {x['keyword'].replace(' ', '-'): i for i, x in enumerate(q['queue'])}
    drafts = []
    for f in BLOG.glob('[!_]*.md'):
        m = meta_of(f.read_text(encoding='utf-8'))
        if not m.get('date') and not m.get('publishedAt'):
            drafts.append((order.get(m.get('slug', f.stem), 10**6), f.stem, f, m))
    drafts.sort()
    plan = list(zip(drafts, dates(start, len(drafts))))
    for (_, _, f, m), d in plan:
        print(d.isoformat(), m.get('slug'))
    if dry:
        return
    by_slug = {x['keyword'].replace(' ', '-'): x for x in q['queue']}
    for (_, _, f, m), d in plan:
        f.write_text(set_date(f.read_text(encoding='utf-8'), d.isoformat()), encoding='utf-8', newline='')
        x = by_slug.get(m.get('slug'))
        if x:
            x.update(status='done', publishedSlug=m['slug'], publishedAt=d.isoformat())
    QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=1), encoding='utf-8')
    cfg = json.loads(DRIP.read_text(encoding='utf-8'))
    cfg['launch'] = start.isoformat()
    DRIP.write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{len(plan)}편 날짜 채움, data/drip.json launch = {start}')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    if not a:
        demo(); sys.exit()
    main(dt.date.fromisoformat(a[0]), '--dry' in sys.argv)
