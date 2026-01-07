import { getAnalyzedOrders } from '@/lib/data-loader';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

// URL 파라미터(searchParams)를 받습니다.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next.js 15 스타일 비동기 처리
}) {
  const params = await searchParams; // Next.js 15에서는 await 필요
  const filterType = params.filter;

  // 1. 전체 데이터 로드
  let orders = await getAnalyzedOrders();

  // 2. URL 필터 적용
  let title = "📊 전체 오더 현황";
  let description = "모든 오더 데이터를 조회합니다.";

  if (filterType === 'unfinished') {
    orders = orders.filter(o => o.isUnfinished);
    title = "🚧 미마감 오더 (Unfinished Only)";
    description = "상태가 REL(릴리즈)이지만 DLV(납품완료) 처리가 안 된 건입니다.";
  } else if (filterType === 'error') {
    orders = orders.filter(o => o.hasCrossMonthError);
    title = "🚨 월 불일치 오더 (Mismatch Only)";
    description = "입고월과 투입월이 달라서 원가 마감 시 에러가 발생하는 건입니다.";
  }

  // 3. 통계 (현재 뷰 기준)
  const totalCount = orders.length;
  // 전체 데이터 기준 통계 (카드에 항상 전체 현황을 보여줄지, 필터된 것만 보여줄지 선택. 여기선 필터된 데이터 기준)

  return (
    <div className="container mx-auto">
      <div className="flex flex-col mb-8 gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <DataTable columns={columns} data={orders} />
    </div>
  );
}