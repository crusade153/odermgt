import Link from "next/link";
import { ArrowLeft, Calendar, Package, Info } from "lucide-react";
import { getAnalyzedOrders } from "@/lib/data-loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Next.js 15: 동적 라우트 파라미터 타입 정의
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
    // 1. URL에서 오더 번호(ID) 추출
    const { id } = await params;

    // 2. 전체 데이터에서 해당 오더 찾기
    // (실제 DB라면 select * from where order=id 겠지만, 지금은 CSV라 전체 로드 후 찾기)
    const allOrders = await getAnalyzedOrders();
    const order = allOrders.find((o) => o.orderNumber === id);

    // 3. 오더가 없을 경우 예외 처리
    if (!order) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">오더를 찾을 수 없습니다.</h2>
                <p className="text-slate-500 mb-8">요청하신 오더 번호: {id}</p>
                <Link href="/" className="text-blue-600 hover:underline">
                    메인으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 max-w-5xl">
            {/* 뒤로가기 버튼 */}
            <Link
                href="/"
                className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors bg-white px-3 py-2 rounded border hover:bg-slate-50"
            >
                <ArrowLeft size={16} className="mr-2" />
                목록으로 돌아가기
            </Link>

            {/* 1. 상단 헤더 (타이틀 & 배지) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-lg border shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Order #{order.orderNumber}
                        </h1>
                        {/* 상태 배지 표시 */}
                        {order.hasCrossMonthError && <Badge variant="destructive">월 불일치</Badge>}
                        {order.isUnfinished && <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">미마감</Badge>}
                        {!order.hasCrossMonthError && !order.isUnfinished && <Badge variant="secondary" className="text-green-600 bg-green-50">정상</Badge>}
                    </div>
                    <p className="text-lg text-slate-600 font-medium">{order.materialDescription}</p>
                </div>
                <div className="text-right bg-slate-50 px-4 py-2 rounded border border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Plant</div>
                    <div className="font-bold text-xl text-slate-800">{order.plant}</div>
                </div>
            </div>

            {/* 2. 요약 정보 카드 3개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 카드 1: 시스템 상태 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <Info size={16} /> 시스템 상태
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-slate-800 break-words">{order.systemStatus}</div>
                        <div className="text-xs text-slate-400 mt-2">오더유형: <span className="text-slate-600 font-mono">{order.orderType}</span></div>
                    </CardContent>
                </Card>

                {/* 카드 2: 일정 정보 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <Calendar size={16} /> 생산 일정
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">기본 시작일:</span>
                            <span className="font-medium">{order.basicStartDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">실제 종료일:</span>
                            <span className={`font-medium ${order.actualFinishDate ? 'text-slate-900' : 'text-slate-300'}`}>
                                {order.actualFinishDate || '(미종료)'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* 카드 3: 수량 정보 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <Package size={16} /> 수량 정보
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">{order.orderQuantity.toLocaleString()}</span>
                            <span className="text-sm text-slate-500 font-medium mb-1.5">{order.unit}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                            납품 수량: {order.deliveredQuantity.toLocaleString()} {order.unit}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. 자재 이동 내역 (핵심 분석 영역) */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    📦 자재 이동 내역 (Material Movements)
                </h2>

                <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[120px]">이동유형</TableHead>
                                <TableHead className="w-[150px]">전기일 (Posting)</TableHead>
                                <TableHead className="w-[120px]">자재코드</TableHead>
                                <TableHead>자재내역</TableHead>
                                <TableHead className="text-right w-[120px]">수량</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.materialLogs.length > 0 ? (
                                order.materialLogs.map((log, idx) => {
                                    // 101(입고)과 261(투입) 강조 로직
                                    const isGR = log.movementType === '101'; // 입고
                                    const isGI = log.movementType === '261'; // 투입

                                    // 로우 배경색: 입고는 초록빛, 투입은 파란빛
                                    let rowClass = "hover:bg-slate-50 transition-colors";
                                    if (isGR) rowClass = "bg-green-50/60 hover:bg-green-100/60";
                                    if (isGI) rowClass = "bg-blue-50/60 hover:bg-blue-100/60";

                                    return (
                                        <TableRow key={idx} className={rowClass}>
                                            <TableCell>
                                                <Badge variant={isGR ? "default" : isGI ? "secondary" : "outline"}
                                                    className={isGR ? "bg-green-600 hover:bg-green-700" : isGI ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}>
                                                    {log.movementType} ({isGR ? "입고" : isGI ? "투입" : "기타"})
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold font-mono text-slate-700">
                                                {log.postingDate}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-slate-500">{log.material}</TableCell>
                                            <TableCell className="text-sm">{log.materialDescription}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {log.quantity.toLocaleString()} {log.unit}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                        <Package className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                                        <p>자재 이동 내역이 없습니다.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}