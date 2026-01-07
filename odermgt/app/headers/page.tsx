import { getRawHeaders } from '@/lib/data-loader';

export default async function HeadersPage() {
    const headers = await getRawHeaders();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">📂 오더 헤더 원본 (Raw Data)</h1>
            <div className="bg-white rounded-md border overflow-auto h-[80vh]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 sticky top-0">
                        <tr>
                            <th className="p-3 border-b font-medium text-slate-600">오더번호</th>
                            <th className="p-3 border-b font-medium text-slate-600">자재내역</th>
                            <th className="p-3 border-b font-medium text-slate-600">시스템 상태</th>
                            <th className="p-3 border-b font-medium text-slate-600">시작일</th>
                            <th className="p-3 border-b font-medium text-slate-600">종료일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {headers.map((h, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-mono text-blue-600">{h.orderNumber}</td>
                                <td className="p-3">{h.materialDescription}</td>
                                <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{h.systemStatus}</span></td>
                                <td className="p-3 text-slate-500">{h.basicStartDate}</td>
                                <td className="p-3 text-slate-500">{h.basicEndDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}