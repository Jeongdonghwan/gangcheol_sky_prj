import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS, openHubs, hubPath, hubEncodedPath, hubPages, pagePath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { IconArrow, JsonLd, PageHead } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `지역별 스카이차 안내 — 인천·김포·부천 | ${BRAND}`;
const DESC = '인천 10개 군·구(제물포·영종·서해·검단구 등 2026-07 개편 이름), 김포, 부천 원미·소사·오정구의 스카이차 임대·대여·작업 안내 페이지를 지역별로 모았습니다.';
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/area/' },
  ...shareMeta('area', '지역별 스카이차 안내', { title: TITLE, description: DESC, url: '/area/' }),
};

export default function AreaIndex() {
  const hubs = openHubs();
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }]),
        itemListJsonLd(hubs.map((h) => ({ name: `${REGIONS[h].name} 스카이차 안내`, path: hubEncodedPath(h) }))),
      ]} />
      <PageHead crumbs={[{ name: '홈', href: '/' }, { name: '지역' }]} title="지역별 스카이차 안내"
        lead="인천은 홈페이지 영업안내의 '인천 전지역 및 기타지역 출장상담', 김포·부천은 네이버 플레이스 소개의 '서울·경기·인천 출장' 범위입니다." />
      <div className="wrap content">
        {hubs.map((h) => {
          const R = REGIONS[h];
          const list = hubPages(h).filter((p) => p.label === h).slice(0, 6);
          return (
            <section key={h} className="hub-row" data-reveal>
              <div>
                <h2><Link href={hubPath(h)}>{R.name} <IconArrow /></Link></h2>
                <p>{R.note}</p>
              </div>
              <ul className="linklist">{list.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
