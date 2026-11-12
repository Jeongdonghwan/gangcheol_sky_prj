import { SITE_URL, SITE_NAME, BRAND, CONTACT, BUSINESS } from './site';

// 업체 — 주소는 네이버 플레이스(2026-07 개편 기준 검단구). 영업시간 24시간·연중무휴(플레이스)
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/c1.jpg`,
  telephone: CONTACT.phone,
  address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '인천광역시', addressLocality: BUSINESS.locality, streetAddress: '서로3로 255' },
  openingHours: 'Mo-Su 00:00-24:00',
  sameAs: [BUSINESS.place],
  areaServed: ['인천광역시', '김포시', '부천시'],
  knowsAbout: ['스카이차 임대', '스카이차 대여', '외벽 작업', '간판 설치·해체', '유리·샷시 작업', '실리콘 작업', '자재 운반', '중량물 상하차', '페인트 바스켓 작업', '조경·절단 작업'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? BRAND : it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: '스카이차 임대·작업',
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  areaServed: { '@type': 'Place', name: o.area },
  provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀 ItemList — 같은 도메인 절대 URL(인코딩된 경로). image 는 실제 사진이 있을 때만
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name,
    ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}),
  })),
});
