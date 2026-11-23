import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, REGIONS, getPage, pagePath, pageEncodedPath, hubPath, hubEncodedPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { BigCall, Btn, IconArrow, JsonLd, Photo } from '../../components/Common';

export const dynamicParams = false;

// 순차 오픈: OPEN_WAVE 이하 페이지만 생성
export function generateStaticParams() {
  return OPEN_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = pageEncodedPath(p);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    ...shareMeta(p.slug, `${p.kw} - ${BRAND}`, { title: c.title, description: c.description, url }),
  };
}

// 레이 모범 구조(2026-11-24): 분류 줄 → h1(키워드 + 수식어) → 설명 → 핵심 요약 → 번호 절 6개 → FAQ → 관련 링크
export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const R = REGIONS[p.label];
  const G = REGIONS[p.gu];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const groups = [
    { h: `${R.name} 다른 안내`, items: rel.samePlace.slice(0, 5) },
    { h: `${G.name} 다른 곳`, items: rel.sameHub.slice(0, 5) },
    { h: '다른 지역', items: rel.others.slice(0, 4) },
  ].filter((g) => g.items.length);
  const relList = groups.flatMap((g) => g.items).map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${G.name} 스카이차`, path: hubEncodedPath(p.gu) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: R.full.split(' (')[0] }),
        faqJsonLd(c.faq),
        itemListJsonLd(relList.length ? relList : [{ name: `${G.name} 지역 안내`, path: hubEncodedPath(p.gu) }]),
      ]} />

      <section className="hero hero-split">
        <div className="wrap hero-in">
          <div className="hero-top">
            <nav className="crumbs" aria-label="경로">
              <span><Link href="/">홈</Link></span><span><i>/</i><Link href="/area/">지역</Link></span><span><i>/</i><Link href={hubPath(p.gu)}>{G.name}</Link></span>
            </nav>
            <div className="x-cat">{c.cat}</div>
            <h1><span>{p.kw}</span>{' '}<span className="hero-sub">{c.h1sub}</span></h1>
            <p className="hero-lead">{c.lead}</p>
          </div>
          <figure className="hero-ph single">
            <Photo id={c.hero.id} lazy={false} alt={`${p.kw} - ${c.hero.caption}`} />
            <figcaption>{c.hero.caption}</figcaption>
          </figure>
          <div className="hero-bot">
            <BigCall />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap x-grid">
          <div className="x-main">
            <section className="x-sum" data-reveal>
              <h2>{p.kw} 핵심 요약</h2>
              <p>{c.summary}</p>
              <dl>{c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </section>
            <article className="x-article">
              {c.sections.map((x) => <section key={x.h}><h2>{x.h}</h2><p>{x.p}</p></section>)}
            </article>
            <div className="x-photos">
              {c.photos.map((ph) => <figure key={ph.id}><Photo id={ph.id} alt={`${p.kw} 참고 사진 - ${ph.caption}`} /></figure>)}
            </div>
            <section className="x-faq faq" id="faq">
              <h2>{p.kw} 자주 묻는 질문</h2>
              {c.faq.map((f) => <details key={f.q}><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}
            </section>
          </div>
          <aside className="x-side">
            <h3>바로 확인</h3>
            <dl>{c.facts.slice(1, 3).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <Btn />
          </aside>
        </div>
      </section>

      <section className="sec gray">
        <div className="wrap related">
          {groups.map((g) => <div key={g.h}><h3>{g.h}</h3><ul>{g.items.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>)}
          {groups.length === 0 && <div><h3>지역 안내</h3><ul><li><Link href={hubPath(p.gu)}>{G.name} 지역 안내 전체<IconArrow /></Link></li></ul></div>}
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <BigCall />
        </div>
      </section>
    </main>
  );
}
