import { getRawMaterials } from '@/lib/data-loader';

export default async function MaterialsPage() {
    const materials = await getRawMaterials();

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">📦 자재 문서 원본 (Raw Data)</h1>
            <div className="bg-white rounded-md border overflow-auto h-[80vh]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 sticky top-0">
                        <tr>
                            <th className="p-2 border-b">오더번호</th>
                            <th className="p-2 border-b">이동유형</th>
                            <th className="p-2 border-b">자재</th>
                            <th className="p-2 border-b">전기일</th>
                            <th className="p-2 border-b">수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((m, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50">
                                <td className="p-2 font-mono">{m.orderNumber}</td>
                                <td className="p-2 font-bold">{m.movementType}</td>
                                <td className="p-2">{m.materialDescription}</td>
                                <td className="p-2">{m.postingDate}</td>
                                <td className="p-2">{m.quantity} {m.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}