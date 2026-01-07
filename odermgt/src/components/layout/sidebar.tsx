import Link from "next/link";
import { LayoutDashboard, AlertTriangle, FileText, PackageSearch, CheckSquare } from "lucide-react";

export function Sidebar() {
    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col fixed left-0 top-0 z-50">
            <div className="mb-8 px-2">
                <h1 className="text-xl font-bold tracking-wider text-green-400">ORDER MGT</h1>
                <p className="text-xs text-slate-400">SAP Data Analysis System</p>
            </div>

            <nav className="space-y-2 flex-1">
                {/* 메인 메뉴 */}
                <div className="text-xs font-semibold text-slate-500 mb-2 px-2">DASHBOARD</div>

                <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
                    <LayoutDashboard size={18} />
                    <span>전체 현황</span>
                </Link>
                <Link href="/?filter=unfinished" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors text-orange-300">
                    <CheckSquare size={18} />
                    <span>미마감 건 (Only)</span>
                </Link>
                <Link href="/?filter=error" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors text-red-300">
                    <AlertTriangle size={18} />
                    <span>월 불일치 (Only)</span>
                </Link>

                {/* 데이터 뷰어 */}
                <div className="text-xs font-semibold text-slate-500 mt-6 mb-2 px-2">RAW DATA</div>

                <Link href="/headers" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
                    <FileText size={18} />
                    <span>오더 헤더 (Header)</span>
                </Link>
                <Link href="/materials" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
                    <PackageSearch size={18} />
                    <span>자재 문서 (Material)</span>
                </Link>
            </nav>

            <div className="text-xs text-slate-600 px-2">
                v1.0.0 Dev Build
            </div>
        </div>
    );
}