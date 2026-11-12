// out/rss.xml — 네이버 서치어드바이저 제출용. 공개된 블로그 글(최신순) + 열린 묶음(OPEN_WAVE)의 키워드 페이지
import { SITE_URL, SITE_NAME, BRAND } from '../../lib/site';
import { OPEN_PAGES, pageEncodedPath } from '../../lib/data';
import { compose } from '../../lib/compose';
import { getPosts, postEncodedPath } from '../../lib/blog';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const posts = getPosts().map((p) => {
    const link = `${SITE_URL}${postEncodedPath(p)}`;
    return `<item><title>${esc(p.title)}</title><link>${link}</link><description>${esc(p.description)}</description><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><guid isPermaLink="true">${link}</guid></item>`;
  });
  const items = OPEN_PAGES.map((p) => {
    const c = compose(p);
    const link = `${SITE_URL}${pageEncodedPath(p)}`;
    return `<item><title>${esc(c.title)}</title><link>${link}</link><description>${esc(c.description)}</description><guid isPermaLink="true">${link}</guid></item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${esc(SITE_NAME)}</title><link>${SITE_URL}/</link><description>${esc(`인천·김포·부천 스카이차 임대·대여·작업 ${BRAND}. 지역별 안내와 높은 곳 작업 궁금증 글.`)}</description><language>ko</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${[...posts, ...items].join('\n')}
</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
