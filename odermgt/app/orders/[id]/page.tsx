import { notFound } from "next/navigation";
import { getAnalyzedOrderById } from "@/lib/data-loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Next.js 15: params는 Promise 타입 필수
export default async function OrderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // 1. URL에서 id 가져오기 (await 필수)
    const { id } = await params;

    // 2. 데이터 조회
    const order = await getAnalyzedOrderById(id);

    // 3. 데이터가 없으면 404 처리
    if (!order) {
        notFound();
    }

    // 4. 화면 렌더링
    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    오더 상세 정보: {order.orderNumber}
                </h1>
                <div className="flex gap-2">
                    {order.isUnfinished && <Badge variant="destructive">미마감 (Unfinished)</Badge>}
                    {order.hasCrossMonthError && <Badge variant="destructive">월 불일치 (Error)</Badge>}
                    {!order.isUnfinished && !order.hasCrossMonthError && <Badge variant="outline">정상 (Normal)</Badge>}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 기본 정보 카드 */}
                <Card>
                    <CardHeader>
                        <CardTitle>기본 정보 (Basic Info)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">자재 내역</span>
                            <span>{order.materialDescription}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">플랜트</span>
                            <span>{order.plant}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">시스템 상태</span>
                            <span>{order.systemStatus}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">오더 수량</span>
                            <span>{order.orderQuantity.toLocaleString()} {order.unit}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 일정 정보 카드 */}
                <Card>
                    <CardHeader>
                        <CardTitle>일정 정보 (Schedule)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">기본 시작일</span>
                            <span>{order.basicStartDate}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">기본 종료일</span>
                            <span>{order.basicEndDate}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">실제 릴리스일</span>
                            <span>{order.actualReleaseDate}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">실제 종료일</span>
                            <span>{order.actualFinishDate}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 자재 문서 로그 테이블 */}
            <Card>
                <CardHeader>
                    <CardTitle>관련 자재 문서 (Material Documents)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>전기일</TableHead>
                                <TableHead>이동유형</TableHead>
                                <TableHead>자재</TableHead>
                                <TableHead>자재내역</TableHead>
                                <TableHead className="text-right">수량</TableHead>
                                <TableHead>단위</TableHead>
                                <TableHead>문서번호</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.materialLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        데이터가 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                order.materialLogs.map((log, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{log.postingDate}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{log.movementType}</Badge>
                                        </TableCell>
                                        <TableCell>{log.material}</TableCell>
                                        <TableCell>{log.materialDescription}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {log.quantity.toLocaleString()}
                                        </TableCell>
                                        <TableCell>{log.unit}</TableCell>
                                        <TableCell>{log.materialDocNumber}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}