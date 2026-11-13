// 공통 UI — 강철 남색 다크 톤 + 주황 1색, 모서리 0, 선 아이콘, 이모지 없음. (참고: web_Agency techcorp 헤더·히어로·섹션 리듬)
import Link from 'next/link';
import { BRAND, CONTACT, BUSINESS, tel, smsHref } from '../lib/site';
import { photo } from '../lib/data';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}</>
);

const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = ({ size = 18 }: { size?: number }) => <Svg size={size} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M4 12h15M13 6l6 6-6 6" size={16} />;

// 큰 전화 — 히어로·상담 띠 공통. 번호 자체가 버튼
export const BigCall = ({ note }: { note?: string }) => (
  <div className="bigcall">
    <a className="bigcall-num" href={tel} aria-label={`전화 ${CONTACT.phone}`}><IconPhone size={26} /><span>{CONTACT.phone}</span></a>
    <p className="bigcall-note">{note || `${CONTACT.hours} 상담`} · <a className="lnk" href={smsHref}>현장 사진 문자로 보내기</a></p>
  </div>
);

export const Btn = ({ dark = false }: { dark?: boolean }) => (
  <a className={dark ? 'btn btn-dark' : 'btn'} href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
);

export const Photo = ({ id, className, lazy = true, alt }: { id: string; className?: string; lazy?: boolean; alt?: string }) => {
  const p = photo(id);
  return <img src={`/img/${id}.webp`} className={className} alt={alt || `${BRAND} 스카이차 작업 사진 - ${p.caption}`} width={p.w} height={p.h} loading={lazy ? 'lazy' : undefined} />;
};

export const SectionHead = ({ title, sub, center = false }: { title: string; sub?: string; center?: boolean }) => (
  <header className={center ? 'sh sh-c' : 'sh'} data-reveal>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

// 히어로 배경 — 실제 사진을 원본 높이 가까이 이어 붙이고(늘리지 않음) 위에 어둡게 깐다
export const HeroBg = ({ ids, alts = [] }: { ids: string[]; alts?: string[] }) => (
  <div className="hero-bg">
    <div className="hero-strip">{ids.map((id, i) => <Photo key={id} id={id} lazy={false} alt={alts[i]} />)}</div>
    <span className="hero-shade" aria-hidden="true" />
  </div>
);

// 허브·블로그 머리 — 사진 띠 배경 + 빵부스러기 (참고: 페이지 상단 사진 배너)
export const PageHead = ({ crumbs, title, lead }: { crumbs: { name: string; href?: string }[]; title: string; lead?: string }) => (
  <section className="hero hero-sub">
    <HeroBg ids={['p5', 'p6', 'p7', 'p2']} />
    <div className="wrap hero-in">
      <nav className="crumbs" aria-label="경로">
        {crumbs.map((c, i) => <span key={i}>{i > 0 && <i>/</i>}{c.href ? <Link href={c.href}>{c.name}</Link> : c.name}</span>)}
      </nav>
      <h1>{title}</h1>
      {lead && <p className="hero-lead">{lead}</p>}
      <Btn />
    </div>
  </section>
);

export const Logo = () => (
  <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
    <span className="logo-mark" aria-hidden="true"><i /></span>
    <span className="logo-text"><b>{BRAND}</b><small>스카이차 임대 · 대여 · 작업 · 출장</small></span>
  </Link>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Logo />
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/#works" className="hide-m">작업</Link>
        <Link href="/area/" className="hide-m">지역</Link>
        <Link href="/blog/" className="hide-m">블로그</Link>
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div className="foot-about">
        <Logo />
        <p>스카이차 임대 · 대여 · 작업 · 출장<br />외벽 · 고층 · 간판 설치·해체 · 유리·샷시 · 실리콘 · 자재 운반 · 중량물 상하차 · 바스켓 페인트 · 조경·절단</p>
      </div>
      <div className="foot-links">
        <strong>바로가기</strong>
        <p><Link href="/area/">지역 안내</Link><Link href="/blog/">블로그</Link><a href="/rss.xml">RSS</a></p>
      </div>
      <dl className="foot-info">
        <div><dt>상호</dt><dd>{BRAND}</dd></div>
        <div><dt>전화</dt><dd><a href={tel}>{CONTACT.phone}</a></dd></div>
        <div><dt>시간</dt><dd>{CONTACT.hours}</dd></div>
        <div><dt>주소</dt><dd>{BUSINESS.address}</dd></div>
        {BUSINESS.bizNumber && <div><dt>사업자</dt><dd>{BUSINESS.bizNumber}</dd></div>}
      </dl>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 상담 때 받은 주소·연락처는 출장 안내에만 씁니다.</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
    <a href={smsHref} className="sb-sms"><IconMsg />문자</a>
  </div>
);
