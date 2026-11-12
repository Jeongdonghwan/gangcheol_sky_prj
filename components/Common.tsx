// 공통 UI — 장비 톤: 검정 + 주황 1색, 모서리 0, 선 아이콘, 이모지 없음.
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

export const SectionHead = ({ title, sub }: { title: string; sub?: string }) => (
  <header className="sh" data-reveal>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

// 허브·블로그 머리 — 검정 띠, 오른쪽에 작은 실차 사진(원본 크기 이하)
export const PageHead = ({ crumbs, title, lead, photoId = 'c3' }: { crumbs: { name: string; href?: string }[]; title: string; lead?: string; photoId?: string }) => (
  <section className="phead">
    <div className="wrap phead-in">
      <div>
        <nav className="crumbs" aria-label="경로">
          {crumbs.map((c, i) => <span key={i}>{i > 0 && <i>/</i>}{c.href ? <Link href={c.href}>{c.name}</Link> : c.name}</span>)}
        </nav>
        <h1>{title}</h1>
        {lead && <p className="phead-lead">{lead}</p>}
        <Btn />
      </div>
      <figure className="phead-ph"><Photo id={photoId} lazy={false} /></figure>
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
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>스카이차 임대 · 대여 · 작업 · 출장<br />외벽 · 고층 · 간판 설치·해체 · 유리·샷시 · 실리콘 · 자재 운반 · 중량물 상하차 · 바스켓 페인트 · 조경·절단</p>
        <p><Link href="/area/">지역 안내</Link> · <Link href="/blog/">블로그</Link> · <a href="/rss.xml">RSS</a></p>
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
