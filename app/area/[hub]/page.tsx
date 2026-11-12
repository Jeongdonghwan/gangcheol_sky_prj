import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { REGIONS, openHubs, hubEncodedPath, hubPages, pagePath, pageEncodedPath } from '../../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { JsonLd, PageHead } from '../../../components/Common';
import { BRAND, shareMeta } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return openHubs().map((hub) => ({ hub }));
}
const key = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };

export function generateMetadata({ params }: { params: { hub: string } }): Metadata {
  const h = key(params.hub);
  const R = REGIONS[h];
  if (!R) return {};
  const title = `${R.name} 스카이차 임대·대여·작업 안내 | ${BRAND}`;
  const description = `${R.full.split(' (')[0]} 스카이차 안내 모음. 외벽·간판·유리·실리콘·자재 운반을 기사가 직접 작업합니다. 동네별 비용·업체·24시·당일 안내 페이지.`;
  return { title, description, alternates: { canonical: hubEncodedPath(h) }, ...shareMeta(`area-${h}`, `${R.name} 스카이차 안내`, { title, description, url: hubEncodedPath(h) }) };
}

export default function Hub({ params }: { params: { hub: string } }) {
  const h = key(params.hub);
  const R = REGIONS[h];
  if (!R) notFound();
  const pages = hubPages(h);
  const labels = Array.from(new Set(pages.map((p) => p.label)));
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${R.name} 스카이차`, path: hubEncodedPath(h) }]),
        itemListJsonLd(pages.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PageHead crumbs={[{ name: '홈', href: '/' }, { name: '지역', href: '/area/' }, { name: R.name }]} title={`${R.name} 스카이차 안내`}
        lead={`${R.full}. ${R.note}`} photoId={R.city === '김포' ? 'c4' : R.city === '부천' ? 'c2' : 'c3'} />
      <div className="wrap content">
        {labels.map((l) => {
          const L = REGIONS[l];
          return (
            <section key={l} id={l} className="hub-block">
              <h2>{L.name}<small>{L.unit}</small></h2>
              {l !== h && <p>{L.note}</p>}
              <ul className="kwgrid">{pages.filter((p) => p.label === l).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}</ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
