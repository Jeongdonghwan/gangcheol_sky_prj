// 사이트 설정 — 연락처·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: source/facts.md — 홈페이지(01055758225.m7114.kr) 푸터·인사말·영업안내, 네이버 플레이스 1414031534.
//   주소: 홈페이지 표기 '인천광역시 서구 서로3로 255' → 2026-07 인천 개편 기준 '검단구'(플레이스 표기, 지번 원당동 987-1)
//   영업시간: 플레이스 '24시간 영업 · 연중무휴'. 장비 톤수·작업 높이·대수는 어디에도 없어 쓰지 않는다.

// 도메인 미정 — 확정되면 SITE_URL 과 data/drip.json siteUrl 을 같이 바꾼다
export const SITE_URL = process.env.SITE_URL || 'http://127.0.0.1:18991';
export const BRAND = '강철스카이';
export const SITE_NAME = `${BRAND} | 인천·김포·부천 스카이차 임대·작업`;

export const CONTACT = {
  phone: '010-5575-8225', // 홈페이지 대표전화·휴대전화 (일반 휴대폰 번호)
  hours: '24시간 · 연중무휴', // 네이버 플레이스
};

export const BUSINESS = {
  name: BRAND,
  address: '인천광역시 검단구 서로3로 255',
  addressOld: '인천광역시 서구 서로3로 255', // 홈페이지 표기(개편 전)
  locality: '검단구',
  place: 'https://m.place.naver.com/place/1414031534/home',
  bizNumber: '', // TODO 사업자등록번호 (수집 자료에 없음)
};

// 순차 오픈: 이 묶음 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다. 1~4 = 25·50·75·100%, 5 이상 = 추가 묶음(extra)
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 1);

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: SITE_NAME, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};

// 서치어드바이저(네이버)·서치콘솔(구글) HTML 태그 소유확인 — content 값만. 도메인 확정 후 받아 넣는다
export const NAVER_VERIFY = '';
export const GOOGLE_VERIFY = '';
