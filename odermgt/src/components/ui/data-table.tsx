"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AnalyzedOrder } from "@/types/sap" // 타입 임포트

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
    })

    // 날짜 필터링 적용
    React.useEffect(() => {
        if (startDate || endDate) {
            table.getColumn("basicStartDate")?.setFilterValue([startDate, endDate]);
        } else {
            table.getColumn("basicStartDate")?.setFilterValue(undefined);
        }
    }, [startDate, endDate, table]);

    const uniquePlants = React.useMemo(() => {
        const plants = new Set<string>()
        data.forEach((item: any) => {
            if (item.plant) plants.add(item.plant)
        })
        return Array.from(plants).sort()
    }, [data])

    // ✨ 핵심 로직: 현재 필터링된 결과(rows)를 실시간으로 가져옴
    const filteredRows = table.getFilteredRowModel().rows;

    // KPI 실시간 계산
    const totalCount = filteredRows.length;
    // row.original의 타입을 알 수 없으므로 타입 단언(assertion) 사용
    const unfinishedCount = filteredRows.filter(r => (r.original as AnalyzedOrder).isUnfinished).length;
    const errorCount = filteredRows.filter(r => (r.original as AnalyzedOrder).hasCrossMonthError).length;


    return (
        <div className="space-y-6">

            {/* 📊 동적 KPI 카드 영역 (필터 결과에 따라 숫자 변함) */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="text-sm font-medium text-muted-foreground">총 조회 오더</div>
                    <div className="text-2xl font-bold">{totalCount} 건</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="text-sm font-medium text-muted-foreground">미마감 (DLV 누락)</div>
                    <div className="text-2xl font-bold text-orange-600">{unfinishedCount} 건</div>
                </div>
                <div className={`rounded-xl border bg-card text-card-foreground shadow p-6 ${errorCount > 0 ? 'bg-red-50 border-red-100' : ''}`}>
                    <div className={`text-sm font-medium ${errorCount > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>월 불일치 (즉시 조치)</div>
                    <div className={`text-2xl font-bold ${errorCount > 0 ? 'text-red-700' : ''}`}>{errorCount} 건</div>
                </div>
            </div>


            {/* 🔍 필터 컨트롤 영역 */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-lg border">
                {/* 오더 검색 */}
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">오더 번호 검색</label>
                    <Input
                        placeholder="오더 번호를 입력하세요..."
                        value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("orderNumber")?.setFilterValue(event.target.value)
                        }
                        className="bg-white"
                    />
                </div>

                {/* 플랜트 선택 */}
                <div className="w-[150px]">
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">플랜트</label>
                    <Select
                        value={(table.getColumn("plant")?.getFilterValue() as string) ?? "ALL"}
                        onValueChange={(value) =>
                            table.getColumn("plant")?.setFilterValue(value === "ALL" ? undefined : value)
                        }
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">전체 플랜트</SelectItem>
                            {uniquePlants.map((plant) => (
                                <SelectItem key={plant} value={plant}>{plant}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 기간 조회 */}
                <div className="flex gap-2 items-end">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">시작일 (From)</label>
                        <Input
                            type="date"
                            className="w-[140px] bg-white"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <span className="pb-2 text-slate-400">~</span>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">종료일 (To)</label>
                        <Input
                            type="date"
                            className="w-[140px] bg-white"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    {(startDate || endDate) && (
                        <Button variant="ghost" size="sm" onClick={() => { setStartDate(""); setEndDate(""); }} className="mb-0.5 text-red-500 hover:text-red-700 hover:bg-red-50">
                            초기화
                        </Button>
                    )}
                </div>
            </div>

            {/* 📋 데이터 테이블 */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const item = row.original as AnalyzedOrder;
                                const isErrorRow = item.hasCrossMonthError;

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={isErrorRow ? "bg-red-50 hover:bg-red-100" : ""}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    검색 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <span className="text-sm text-slate-500 mr-4">
                    Total {table.getFilteredRowModel().rows.length} 건
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    이전
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    다음
                </Button>
            </div>
        </div>
    )
}