import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL } from '../lib/site';
import { getPosts, postEncodedPath } from '../lib/blog';
import { OPEN_PAGES, openHubs, hubEncodedPath, pageEncodedPath } from '../lib/data';

// lastmod = 본문을 만드는 파일들의 수정 시각 (빌드 시각이 아님)
const mtime = (...files: string[]) => new Date(Math.max(...files.map((f) => fs.statSync(path.join(process.cwd(), f)).mtimeMs)));
const PAGE_MOD = mtime('data/site-pages.json', 'data/regions.json', 'lib/compose.ts');
const HOME_MOD = mtime('app/page.tsx', 'data/photos.json');

// 열린 묶음(OPEN_WAVE)의 페이지와 공개된 글만
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: `${SITE_URL}/`, lastModified: HOME_MOD, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/area/`, lastModified: PAGE_MOD, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog/`, lastModified: posts[0] ? new Date(posts[0].publishedAt) : HOME_MOD, changeFrequency: 'daily', priority: 0.6 },
    ...posts.map((p) => ({ url: `${SITE_URL}${postEncodedPath(p)}`, lastModified: new Date(p.publishedAt), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...openHubs().map((h) => ({ url: `${SITE_URL}${hubEncodedPath(h)}`, lastModified: PAGE_MOD, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...OPEN_PAGES.map((p) => ({
      url: `${SITE_URL}${pageEncodedPath(p)}`, lastModified: PAGE_MOD, changeFrequency: 'monthly' as const,
      priority: p.unit === '시·군' ? 0.8 : p.unit === '구' ? 0.7 : 0.6,
    })),
  ];
}
