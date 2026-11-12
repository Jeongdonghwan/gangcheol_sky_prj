import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, REGIONS, getPage, pagePath, pageEncodedPath, hubPath, hubEncodedPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { BigCall, Btn, IconArrow, JsonLd, Photo, SectionHead } from '../../components/Common';

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

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const R = REGIONS[p.label];
  const G = REGIONS[p.gu];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const relList = [...rel.samePlace, ...rel.sameHub, ...rel.others].map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${G.name} 스카이차`, path: hubEncodedPath(p.gu) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: R.full.split(' (')[0] }),
        faqJsonLd(c.faq),
        itemListJsonLd(relList.length ? relList : [{ name: `${G.name} 지역 안내`, path: hubEncodedPath(p.gu) }]),
      ]} />

      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-text">
            <nav className="crumbs" aria-label="경로">
              <span><Link href="/">홈</Link></span><span><i>/</i><Link href="/area/">지역</Link></span><span><i>/</i><Link href={hubPath(p.gu)}>{G.name}</Link></span>
            </nav>
            <h1>{p.kw}</h1>
            <p className="hero-lead">{c.lead}</p>
            <BigCall note={c.callNote} />
            <dl className="hero-specs">{c.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
          <figure className="hero-ph">
            <Photo id={c.hero.id} lazy={false} alt={`${p.kw} - ${c.hero.caption}`} />
            <figcaption>{c.hero.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <p className="answer" data-reveal>{c.answer}</p>
          <SectionHead title={c.region.heading} />
          <div className="cols">
            <div className="prose" data-reveal>{c.region.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
            <aside className="side" data-reveal>
              <h3>{R.unit === '동·읍면' || R.unit === '생활권' ? `${G.name} 주요 현장` : `${R.name} 주요 현장`}</h3>
              <ul className="sq">{c.region.spots.map((h) => <li key={h}>{h}</li>)}</ul>
              {c.region.near.length > 0 && <><h3>같은 구역</h3><p>{c.region.near.join(' · ')}</p></>}
            </aside>
          </div>
        </div>
      </section>

      <section className="sec gray" id="works">
        <div className="wrap">
          <div className="rail-head">
            <SectionHead title={c.works.heading} />
            <div className="rail-nav"><button type="button" data-scroll="-1" data-target="rail-w" aria-label="이전">←</button><button type="button" data-scroll="1" data-target="rail-w" aria-label="다음">→</button></div>
          </div>
          <ol className="rail" id="rail-w">
            {c.works.items.map((x) => (
              <li key={x.key} className="unit" data-reveal>
                <h3>{x.name}</h3>
                <dl><div><dt>쓰는 곳</dt><dd>{x.use}</dd></div></dl>
                <p>{x.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec">
        <div className="wrap narrow">
          <SectionHead title={c.eq.heading} />
          <div className="prose" data-reveal>{c.eq.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
          {c.eq.table && <dl className="spec" data-reveal>{c.eq.table.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-in" data-reveal>
          <p>{c.cta}</p>
          <Btn dark />
        </div>
      </section>

      <section className="sec gray">
        <div className="wrap narrow">
          <SectionHead title={c.intent.heading} />
          <div className="prose" data-reveal>{c.intent.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
          {'table' in c.intent && c.intent.table && <dl className="spec" data-reveal>{c.intent.table.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
          {'list' in c.intent && c.intent.list && <>
            <h3 className="h3-sub" data-reveal>{c.intent.list.title}</h3>
            <ol className="steps-list reveal-group">{c.intent.list.items.map((x) => <li key={x}>{x}</li>)}</ol>
          </>}
        </div>
      </section>

      <section className="sec dark">
        <div className="wrap">
          <SectionHead title="강철스카이 작업 사진" sub={c.photoSub} />
          <div className="shots">
            {c.photos.map((ph, i) => (
              <figure key={ph.id} className="mask" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                <Photo id={ph.id} alt={`${p.kw} 참고 사진 - ${ph.caption}`} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title={c.checks.heading} />
          <ul className="checks reveal-group">{c.checks.items.map((x) => <li key={x}>{x}</li>)}</ul>
          <SectionHead title={`${R.name} 상담부터 작업까지`} />
          <ol className="process reveal-group">{c.steps.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>
        </div>
      </section>

      <section className="sec gray" id="faq">
        <div className="wrap two">
          <div>
            <SectionHead title="상담 안내" />
            <dl className="info" data-reveal>{c.info.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
          <div>
            <SectionHead title="자주 묻는 질문" />
            <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title={`${p.kw} 관련 안내`} />
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{R.name} 다른 안내</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameHub.length > 0 && <div><h3>{G.name} 다른 곳</h3><ul>{rel.sameHub.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            <div><h3>다른 지역</h3><ul>
              {rel.others.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}
              <li><Link href={hubPath(p.gu)}>{G.name} 지역 안내 전체<IconArrow /></Link></li>
            </ul></div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <BigCall note={c.cta} />
        </div>
      </section>
    </main>
  );
}
