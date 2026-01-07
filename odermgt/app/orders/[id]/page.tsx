import { notFound } from "next/navigation";
import { getAnalyzedOrderById } from "@/lib/data-loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function OrderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = await getAnalyzedOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">오더 상세: {order.orderNumber}</h1>
                <div className="flex gap-2">
                    {order.isUnfinished && <Badge variant="destructive">미마감</Badge>}
                    {order.hasCrossMonthError && <Badge variant="destructive">월 불일치</Badge>}
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>기본 정보</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between border-b pb-1">
                        <span className="font-semibold">자재 내역</span>
                        <span>{order.materialDescription}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                        <span className="font-semibold">상태</span>
                        <span>{order.systemStatus}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>자재 문서 이력</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>전기일</TableHead>
                                <TableHead>이동유형</TableHead>
                                <TableHead>자재</TableHead>
                                <TableHead>수량</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.materialLogs.length === 0 ? (
                                <TableRow><TableCell colSpan={4}>데이터 없음</TableCell></TableRow>
                            ) : (
                                order.materialLogs.map((log, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{log.postingDate}</TableCell>
                                        <TableCell>{log.movementType}</TableCell>
                                        <TableCell>{log.material}</TableCell>
                                        <TableCell>{log.quantity}</TableCell>
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