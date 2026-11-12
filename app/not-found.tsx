import { PageHead } from '../components/Common';

export default function NotFound() {
  return (
    <main>
      <PageHead crumbs={[{ name: '홈', href: '/' }]} title="페이지를 찾을 수 없습니다" lead="주소가 바뀌었거나 아직 열리지 않은 페이지입니다. 지역 목록에서 찾거나 전화 주세요." />
    </main>
  );
}
