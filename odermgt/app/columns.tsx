"use client"

import Link from "next/link"; // Link 컴포넌트 추가
import { ColumnDef } from "@tanstack/react-table"
import { AnalyzedOrder } from "@/types/sap"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { ExplanationDialog } from "@/components/explanation-dialog"

export const columns: ColumnDef<AnalyzedOrder>[] = [
    {
        accessorKey: "orderNumber",
        header: "오더 번호",
        cell: ({ row }) => {
            const orderNo = row.getValue("orderNumber") as string;
            return (
                // 🔥 핵심 변경: 단순 텍스트 -> 클릭 가능한 링크
                <Link
                    href={`/orders/${orderNo}`}
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline decoration-blue-400 underline-offset-4 transition-colors"
                >
                    {orderNo}
                </Link>
            );
        },
    },
    {
        accessorKey: "materialDescription",
        header: "자재 내역",
        cell: ({ row }) => (
            <div className="min-w-[250px] whitespace-normal break-keep leading-snug text-slate-700">
                {row.getValue("materialDescription")}
            </div>
        ),
    },
    {
        accessorKey: "plant",
        header: "플랜트",
        filterFn: "equals",
    },
    {
        id: "status",
        header: "상태 분석",
        cell: ({ row }) => {
            const isUnfinished = row.original.isUnfinished
            const hasError = row.original.hasCrossMonthError

            return (
                <div className="flex flex-wrap gap-1">
                    {isUnfinished && (
                        <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50 whitespace-nowrap">
                            미마감
                        </Badge>
                    )}
                    {hasError && (
                        <Badge variant="destructive" className="flex gap-1 items-center whitespace-nowrap bg-red-600">
                            <AlertCircle size={12} />
                            월 불일치
                        </Badge>
                    )}
                    {!isUnfinished && !hasError && (
                        <Badge variant="secondary" className="text-green-600 bg-green-50 whitespace-nowrap">
                            정상
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "basicStartDate",
        header: "시작일",
        filterFn: (row, columnId, filterValue) => {
            const [start, end] = filterValue as [string, string];
            const rowDate = row.getValue(columnId) as string;

            if (!rowDate) return false;
            if (!start && !end) return true;
            if (start && rowDate < start) return false;
            if (end && rowDate > end) return false;
            return true;
        },
    },
    {
        accessorKey: "actualFinishDate",
        header: "종료일",
    },
    {
        id: "actions",
        header: "조치",
        cell: ({ row }) => {
            return (
                <ExplanationDialog
                    orderNumber={row.original.orderNumber}
                    initialExplanation={row.original.explanation}
                />
            )
        },
    },
]