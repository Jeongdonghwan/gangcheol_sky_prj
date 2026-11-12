import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES, PHOTOS, REGIONS, openHubs, hubPath, hubEncodedPath, hubPages, pagePath, pageEncodedPath } from '../lib/data';
import { WORKS } from '../lib/compose';
import { getPosts, postPath } from '../lib/blog';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { BRAND, CONTACT, BUSINESS, shareMeta } from '../lib/site';
import { BigCall, Btn, IconArrow, JsonLd, Photo, SectionHead } from '../components/Common';

const TITLE = `${BRAND} | 인천·김포·부천 스카이차 임대·대여·작업`;
const DESC = `인천 검단구 스카이차 업체 ${BRAND}. 외벽·고층, 간판 설치·해체, 유리·샷시, 실리콘, 자재 운반, 중량물 상하차를 기사가 직접 작업합니다. 24시간·연중무휴 ${CONTACT.phone}.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 스카이차`, { title: TITLE, description: DESC, url: '/' }),
};

const WAYS: [string, string][] = [
  ['임대', '차량과 기사가 함께 현장에 가는 방식. 홈페이지 인사말: 스카이차가 필요한 모든 현장에 전문기술자를 파견해 직접 작업'],
  ['대여', '시공 팀이 따로 있을 때 — 기사가 차를 고정·조종하고 시공 팀이 바스켓에서 작업'],
  ['작업', '간판·실리콘·외벽 보수처럼 바스켓에서 하는 일까지 맡기는 방식'],
  ['출장', '인천 전지역 및 기타지역 출장상담(영업안내), 서울·경기·인천 출장(네이버 플레이스 소개)'],
];

const FAQ = [
  { q: '보유 차량 톤수와 작업 높이는 어떻게 되나요?', a: '홈페이지와 플레이스에 톤수·작업 높이가 적혀 있지 않습니다. 건물 층수와 차 세울 자리를 알려 주시면 맞는 차량인지 통화로 확인합니다.' },
  { q: '밤에도 전화가 되나요?', a: `네이버 플레이스에 24시간 영업·연중무휴로 등록되어 있습니다. ${CONTACT.phone}으로 연락 주세요.` },
  { q: '김포·부천도 오나요?', a: '플레이스 소개에 서울·경기·인천 출장이 적혀 있고, 김포·부천 현장도 상담합니다. 사업장이 인천 검단구라 김포와 맞닿아 있습니다.' },
  { q: '비용은 어떻게 정해지나요?', a: '작업 시간, 높이, 이동 거리, 작업 내용, 도로 통제 여부로 정해집니다. 고정 요금표는 공개하지 않았으니 현장 정보를 알려 주세요.' },
  { q: '사다리차와 다른가요?', a: '사다리차는 짐을 올리는 차이고, 스카이차는 바스켓에 사람이 타고 높은 곳에서 직접 일하는 차입니다. 외벽·간판·유리·실리콘 일은 스카이차로 합니다.' },
];

export default function Home() {
  const hubs = openHubs();
  const posts = getPosts().slice(0, 4);
  const top = OPEN_PAGES.filter((p) => p.unit === '시·군' || p.unit === '구').filter((p) => !p.mod && (p.word === '스카이차' || p.word === '스카이'));
  const groups: [string, string[]][] = [['인천', hubs.filter((h) => REGIONS[h].city === '인천')], ['김포', hubs.filter((h) => REGIONS[h].city === '김포')], ['부천', hubs.filter((h) => REGIONS[h].city === '부천')]];

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }]),
        faqJsonLd(FAQ),
        itemListJsonLd(top.slice(0, 30).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />

      <section className="hero hero-home">
        <div className="wrap hero-in">
          <div className="hero-text">
            <h1>인천·김포·부천<br />스카이차 임대·작업</h1>
            <p className="hero-lead">{BRAND}는 인천 검단구에 사업장을 둔 스카이차 업체입니다. 외벽·고층, 간판 설치·해체, 유리·샷시, 실리콘, 자재 운반을 차와 기사가 함께 가서 바스켓에서 직접 합니다.</p>
            <BigCall />
            <dl className="hero-specs">
              <div><dt>사업장</dt><dd>{BUSINESS.address}</dd></div>
              <div><dt>출장</dt><dd>인천 전지역 · 김포 · 부천</dd></div>
              <div><dt>상담</dt><dd>{CONTACT.hours}</dd></div>
            </dl>
          </div>
          <figure className="hero-ph">
            <Photo id="p1" lazy={false} alt={`${BRAND} 스카이차 - 차체에 010-5575-8225 표기`} />
            <figcaption>{PHOTOS[0].caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="sec" id="works">
        <div className="wrap">
          <div className="rail-head">
            <SectionHead title="바스켓에서 하는 작업" sub="홈페이지 영업안내에 적힌 작업 목록 그대로입니다." />
            <div className="rail-nav"><button type="button" data-scroll="-1" data-target="rail-h" aria-label="이전">←</button><button type="button" data-scroll="1" data-target="rail-h" aria-label="다음">→</button></div>
          </div>
          <ol className="rail" id="rail-h">
            {WORKS.map((x) => (
              <li key={x.key} className="unit" data-reveal>
                <h3>{x.name}</h3>
                <dl><div><dt>쓰는 곳</dt><dd>{x.use}</dd></div><div><dt>알려 줄 것</dt><dd>{x.ask}</dd></div></dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec gray">
        <div className="wrap narrow">
          <SectionHead title="임대 · 대여 · 작업 · 출장" sub="차만 보내는 일은 없습니다. 차를 다루는 기사가 함께 갑니다." />
          <dl className="spec spec-wide" data-reveal>{WAYS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <p className="note" data-reveal>보유 차량의 톤수와 작업 높이는 홈페이지에 적혀 있지 않습니다. 작업 층수를 알려 주시면 통화로 맞는 차량을 확인합니다.</p>
        </div>
      </section>

      <section className="sec dark">
        <div className="wrap">
          <SectionHead title="작업 사진" sub="홈페이지 작업사진 게시판과 인사말·영업안내에 실린 실제 차량입니다. 촬영 장소는 표기되어 있지 않습니다." />
          <div className="gallery">
            {PHOTOS.map((ph, i) => (
              <figure key={ph.id} className={`mask g-${ph.w >= 560 ? 'w' : 't'}`} data-reveal style={{ transitionDelay: `${(i % 4) * 80}ms`, ['--w' as string]: `${ph.w}px` }}>
                <Photo id={ph.id} />
                <figcaption>{ph.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-in" data-reveal>
          <p>현장 주소, 작업 층수, 할 일 세 가지를 알려 주세요.</p>
          <Btn dark />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title="출장 지역" sub="인천 10개 군·구(2026-07 개편 이름)와 김포, 부천 3개 구" />
          <div className="areas">
            {groups.filter(([, hs]) => hs.length).map(([city, hs]) => (
              <div key={city} className="area-col" data-reveal>
                <h3>{city}</h3>
                <ul>{hs.map((h) => <li key={h}><Link href={hubPath(h)}><span>{REGIONS[h].name}</span><small>{hubPages(h).length}개 안내</small><IconArrow /></Link></li>)}</ul>
              </div>
            ))}
          </div>
          <p className="more-row"><Link href="/area/" className="lnk">지역 전체 보기 <IconArrow /></Link></p>
        </div>
      </section>

      <section className="sec gray">
        <div className="wrap">
          <SectionHead title="상담부터 작업까지" />
          <ol className="process reveal-group">
            <li><strong>전화 상담</strong><p>{CONTACT.phone}, 24시간 받습니다.</p></li>
            <li><strong>현장 정보</strong><p>주소·층수·할 일을 말씀해 주세요. 사진은 문자로.</p></li>
            <li><strong>차량·일정</strong><p>높이와 진입로에 맞는 차량, 도착 시간을 정합니다.</p></li>
            <li><strong>도착·고정</strong><p>기사가 지지대를 펴 차를 고정합니다.</p></li>
            <li><strong>작업·정리</strong><p>바스켓 작업 후 주변을 정리하고 붐을 접습니다.</p></li>
          </ol>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap two">
          <div>
            <SectionHead title="자주 묻는 질문" />
            <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
          </div>
          <div>
            <SectionHead title={posts.length ? '블로그' : '지역별 대표 안내'} />
            <ul className="linklist">
              {posts.length
                ? posts.map((p) => <li key={p.slug}><Link href={postPath(p)}>{p.title}<IconArrow /></Link></li>)
                : top.slice(0, 8).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>높은 곳 일, 층수와 주소부터 알려 주세요</h2>
          <p>{BRAND} · {BUSINESS.address} · {CONTACT.hours}</p>
          <BigCall />
        </div>
      </section>
    </main>
  );
}
