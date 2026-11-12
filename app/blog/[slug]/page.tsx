import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getPost, postPath, postEncodedPath, ogKey } from '../../../lib/blog';
import { breadcrumbJsonLd } from '../../../lib/jsonld';
import { Btn, IconArrow, JsonLd, PageHead } from '../../../components/Common';
import { BRAND, SITE_URL, shareMeta } from '../../../lib/site';

export const dynamicParams = false;

// 글이 0편이면 정적 export 가 빈 목록을 거부하므로 자리표시 1개 → notFound (sitemap·목록에는 안 나감, deploy.sh 가 지움)
export function generateStaticParams() {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_none' }];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return { title: `블로그 | ${BRAND}`, description: `${BRAND} 블로그 — 공개 전인 글입니다. 스카이차·고소작업 궁금증 목록에서 다른 글과 지역별 안내를 확인해 주세요.`, alternates: { canonical: '/blog/' }, robots: { index: false }, ...shareMeta('blog', `${BRAND} 블로그`, { url: '/blog/' }) };
  const url = postEncodedPath(p);
  const share = shareMeta(ogKey(p), `${p.title} - ${BRAND}`, { title: p.title, description: p.description, url });
  return {
    title: `${p.title} | ${BRAND}`.length > 60 ? p.title : `${p.title} | ${BRAND}`,
    description: p.description,
    alternates: { canonical: url },
    ...share,
    openGraph: { ...share.openGraph, type: 'article', publishedTime: p.publishedAt },
  };
}

const fmt = (d: string) => d.replace(/-/g, '.');

// 본문 인라인: [글자](/경로) 만 링크로. 내부 경로만 Link, 나머지는 글자만
const Inline = ({ text }: { text: string }) => (
  <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((t, i) => {
    const m = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return t;
    return m[2].startsWith('/') ? <Link key={i} href={m[2]}>{m[1]}</Link> : m[1];
  })}</>
);

export default function BlogPost({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const path = postEncodedPath(p);
  const others = getPosts().filter((x) => x.slug !== p.slug).slice(0, 5);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }, { name: p.title, path }]),
        {
          '@context': 'https://schema.org', '@type': 'Article',
          headline: p.title, description: p.description, inLanguage: 'ko',
          datePublished: p.publishedAt, dateModified: p.publishedAt,
          image: `${SITE_URL}/og/${encodeURIComponent(ogKey(p))}.jpg`,
          mainEntityOfPage: `${SITE_URL}${path}`,
          author: { '@id': `${SITE_URL}/#business` }, publisher: { '@id': `${SITE_URL}/#business` }, keywords: p.keyword,
        },
      ]} />
      <PageHead crumbs={[{ name: '홈', href: '/' }, { name: '블로그', href: '/blog/' }]} title={p.title} lead={`${fmt(p.publishedAt)} · ${BRAND}`} photoId="c3" />
      <div className="wrap content">
        <article className="prose post">
          {p.sections.map((s) => (
            <section key={s.h} data-reveal>
              <h2>{s.h}</h2>
              {s.blocks.map((b, j) => {
                if (typeof b === 'string') return <p key={j}><Inline text={b} /></p>;
                const Tag = b.ol ? 'ol' : 'ul';
                return <Tag key={j}>{b.items.map((t, k) => <li key={k}><Inline text={t} /></li>)}</Tag>;
              })}
            </section>
          ))}
        </article>
        <section className="sec-in">
          <h2 className="h2-plain">현장 주소와 작업 층수를 알려 주세요</h2>
          <p className="prose-p">작업할 곳 사진을 문자로 보내 주시면 통화 때 바로 이어서 차량과 일정을 말씀드립니다.</p>
          <Btn />
        </section>
        {others.length > 0 && (
          <section className="sec-in">
            <h2 className="h2-plain">다른 글</h2>
            <ul className="linklist">{others.map((x) => <li key={x.slug}><Link href={postPath(x)}>{x.title}<IconArrow /></Link></li>)}</ul>
          </section>
        )}
      </div>
    </main>
  );
}
