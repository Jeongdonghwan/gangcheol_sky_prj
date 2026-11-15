// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). lib/site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS, openHubs } from '../../lib/data';
import { WORKS } from '../../lib/compose';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd, PageHead } from '../../components/Common';
import { BRAND, BUSINESS, CONTACT, UPDATED, shareMeta, tel, smsHref } from '../../lib/site';

const TITLE = `소개 | ${BRAND}`;
const DESC = `${BRAND}는 스카이차 임대·대여·작업을 하는 곳입니다. 하는 일, 다니는 지역, 연락 방법을 사실대로 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  const areas = openHubs().map((h) => REGIONS[h].name);
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <PageHead crumbs={[{ name: '홈', href: '/' }, { name: '소개' }]} title={`${BRAND} 소개`}
        lead={`${BRAND}는 스카이차 임대·대여와 높은 곳 작업을 하는 업체입니다.`} />
      <div className="wrap content">
        <section className="sec-in">
          <h2 className="h2-plain">하는 일</h2>
          <p className="prose-p">{WORKS.map((w) => w.name).join(', ')}을 합니다.</p>
        </section>
        <section className="sec-in">
          <h2 className="h2-plain">다니는 지역</h2>
          <p className="prose-p">{areas.join(', ')} 지역을 다닙니다. 동네별 안내는 <Link href="/area/">지역 안내</Link>에 있습니다.</p>
        </section>
        <section className="sec-in">
          <h2 className="h2-plain">연락 방법</h2>
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a> 또는 <a href={smsHref}>문자</a>로 받습니다.{CONTACT.hours && ` 영업시간은 ${CONTACT.hours}입니다.`}</p>
          {BUSINESS.address && <p className="prose-p">주소는 {BUSINESS.address}입니다.</p>}
          {BUSINESS.bizNumber && <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
          {BUSINESS.place && <p className="prose-p"><a href={BUSINESS.place} target="_blank" rel="noopener">네이버 플레이스</a>에서도 볼 수 있습니다.</p>}
        </section>
        <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
      </div>
    </main>
  );
}
