import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { OPEN_PAGES, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Btn, IconArrow, JsonLd, PageHead } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const BLOG_TITLE = `스카이차·고소작업 궁금증 블로그 | ${BRAND}`;
const BLOG_DESC = `간판 교체 순서, 외벽 실리콘 보수 시기, 스카이차와 사다리차 차이, 비 오는 날 작업처럼 ${BRAND} 상담 때 자주 받는 높은 곳 작업 질문을 한 편에 하나씩 정리합니다.`;
export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('blog', `${BRAND} 블로그`, { title: BLOG_TITLE, description: BLOG_DESC, url: '/blog/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');

export default function BlogIndex() {
  const posts = getPosts();
  const hubs = OPEN_PAGES.filter((p) => p.unit === '시·군' && !p.mod).slice(0, 8);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }]),
        itemListJsonLd(posts.length ? posts.map((p) => ({ name: p.title, path: postEncodedPath(p) })) : hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PageHead crumbs={[{ name: '홈', href: '/' }, { name: '블로그' }]} title="스카이차·고소작업 궁금증"
        lead="상담 전화에서 자주 듣는 질문을 한 편에 하나씩 답합니다. 현장마다 다른 비용·톤수 숫자는 적지 않습니다." photoId="c4" />
      <div className="wrap content">
        <section className="sec-in">
          <h2 className="h2-plain">최근 글</h2>
          {posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((p) => (
                <li key={p.slug} data-reveal>
                  <Link href={postPath(p)}><span className="meta">{fmt(p.publishedAt)}</span><h3>{p.title}</h3><p>{p.description}</p></Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="prose-p">첫 글을 준비하고 있습니다. 그동안 아래 지역 안내 페이지를 참고해 주세요.</p>
          )}
        </section>
        <section className="sec-in">
          <h2 className="h2-plain">지역별 스카이차 안내</h2>
          <ul className="linklist">{hubs.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          <Btn />
        </section>
      </div>
    </main>
  );
}
