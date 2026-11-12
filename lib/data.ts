// 데이터 로더 — data/site-pages.json(키워드 페이지), regions.json(지역 147곳), photos.json(실차 사진). 빌드 전용.
import pagesData from '../data/site-pages.json';
import regionsData from '../data/regions.json';
import photosData from '../data/photos.json';
import { OPEN_WAVE } from './site';

export interface Page {
  n: number; no: number; kw: string; slug: string; label: string; unit: string; word: string; eq: string; mod: string;
  prio: number; alt: string; gu: string; city: string; wave: number;
}
export interface Region { label: string; name: string; unit: string; parent: string | null; city: string; full: string; note: string; spots: string[]; jobs: string[]; gu: string }
export interface Photo { id: string; w: number; h: number; caption: string }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
export const REGIONS = regionsData.regions as Record<string, Region>;
export const PHOTOS = photosData.photos as Photo[];
export const photo = (id: string) => PHOTOS.find((p) => p.id === id)!;

// 지역 허브 = 시·군·구 16곳 (생활권·동은 상위 구의 허브에 모인다)
export const HUBS = ['인천', '제물포구', '영종', '미추홀', '연수', '남동', '부평', '계양', '서해구', '검단', '강화', '김포', '부천', '원미', '소사', '오정'];
export const openHubs = () => HUBS.filter((h) => OPEN_PAGES.some((p) => p.gu === h));
export const hubPages = (h: string) => OPEN_PAGES.filter((p) => p.gu === h);

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const hubPath = (h: string) => `/area/${h}/`;
export const hubEncodedPath = (h: string) => `/area/${encodeURIComponent(h)}/`;

const bySlug = new Map(OPEN_PAGES.map((p) => [p.slug, p]));
export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return bySlug.get(key);
}

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 관련 페이지 — 열린 페이지만. 같은 지역 다른 키워드 / 같은 허브 다른 지역 같은 단어 / 다른 허브 같은 단어
const byLabel = new Map<string, Page[]>();
for (const x of OPEN_PAGES) { const a = byLabel.get(x.label) || []; a.push(x); byLabel.set(x.label, a); }
export function related(p: Page) {
  const samePlace = rotate((byLabel.get(p.label) || []).filter((x) => x.slug !== p.slug), p.slug, 'sp').slice(0, 5);
  const sameHub = rotate(OPEN_PAGES.filter((x) => x.gu === p.gu && x.label !== p.label && x.eq === p.eq), p.slug, 'hub').slice(0, 5);
  const others = rotate(OPEN_PAGES.filter((x) => x.gu !== p.gu && x.unit !== '동·읍면' && x.word === p.word && x.mod === p.mod), p.slug, 'oc').slice(0, 5);
  return { samePlace, sameHub, others };
}
