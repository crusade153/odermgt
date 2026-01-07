import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import iconv from 'iconv-lite';
import { SapOrderHeader, SapMaterialDocument, AnalyzedOrder } from '@/types/sap';

// 🔍 경로 탐색 헬퍼 (로컬/Vercel 환경 자동 대응)
const getDataPath = (fileName: string) => {
    const pathsToTry = [
        path.join(process.cwd(), 'data', fileName),
        path.join(process.cwd(), '..', 'data', fileName), // Vercel 모노레포 대응
        path.join(process.cwd(), 'public', 'data', fileName), // Fallback
    ];

    for (const p of pathsToTry) {
        if (fs.existsSync(p)) return p;
    }
    console.warn(`⚠️ 파일을 찾을 수 없습니다: ${fileName}`);
    return pathsToTry[0];
};

const HEADER_PATH = getDataPath('header.csv');
const MATERIAL_PATH = getDataPath('material.csv');

// CSV 읽기 공통 함수
const readCsv = async <T>(filePath: string): Promise<T[]> => {
    if (!fs.existsSync(filePath)) return [];
    const fileBuffer = fs.readFileSync(filePath);
    const decodedContent = iconv.decode(fileBuffer, 'euc-kr');
    const { data } = Papa.parse(decodedContent, { header: true, skipEmptyLines: true });
    return data as T[];
};

// 1. 전체 오더 분석 데이터 가져오기
export async function getAnalyzedOrders(): Promise<AnalyzedOrder[]> {
    const rawHeaders = await readCsv<any>(HEADER_PATH);
    const rawMaterials = await readCsv<any>(MATERIAL_PATH);

    return rawHeaders.map((h) => {
        const orderNumber = h['오더'] || '';
        const order: SapOrderHeader = {
            orderNumber: orderNumber,
            plant: h['플랜트'],
            materialDescription: h['자재 내역'] || h['자재 내역_1'],
            systemStatus: h['시스템 상태'],
            basicStartDate: h['기본 시작일'],
            actualFinishDate: h['실제종료일'],
            orderType: h['오더 유형'],
            mrpController: h['MRP 관리자'],
            productionSupervisor: h['생산 감독자'],
            material: h['자재'] || h['자재_1'],
            basicEndDate: h['기본 종료일'] || h['기본 종료일_1'],
            orderQuantity: Number(h['오더 수량 (GMEIN)']?.replace(/,/g, '') || 0),
            confirmedYield: Number(h['확인된 수율 수량 (GMEIN)']?.replace(/,/g, '') || 0),
            deliveredQuantity: Number(h['납품 수량 (GMEIN)']?.replace(/,/g, '') || 0),
            unit: h['단위 (=GMEIN)'],
            productionVersion: h['생산 버전'],
            changeDate: h['변경일'],
            actualReleaseDate: h['릴리스일자(실제)'],
            plannedReleaseDate: h['계획된 릴리스일'],
            programRelease: h['프로그램 릴리스']
        };

        const relatedLogs = rawMaterials
            .filter((m) => (m['오더'] === order.orderNumber) || (m['오더_1'] === order.orderNumber))
            .map((m) => ({
                orderNumber: m['오더'] || m['오더_1'],
                material: m['자재'] || m['자재_1'],
                movementType: m['이동 유형'],
                postingDate: m['전기일'],
                quantity: Number(m['입력단위수량 (ERFME)']?.replace(/,/g, '') || 0),
                plant: m['플랜트'],
                materialDescription: m['자재 내역'],
                movementIndicator: m['자재이동 지시자'],
                unit: m['입력단위 (=ERFME)'],
                materialDocYear: m['자재 문서 연도'],
                materialDocNumber: m['자재 문서'],
                materialDocItem: m['자재 문서 항목'],
                storageLocation: m['저장 위치'],
                batch: m['배치'],
                debitCreditInd: m['차변/대변지시자'],
                amount: Number(m['금액(현지 통화) (WAERS)']?.replace(/,/g, '') || 0),
                currency: m['통화']
            } as SapMaterialDocument));

        const isUnfinished = order.systemStatus?.includes('REL') &&
            !order.systemStatus?.includes('DLV') &&
            !order.systemStatus?.includes('TECO');

        let hasCrossMonthError = false;
        const grLogs = relatedLogs.filter(l => l.movementType === '101');
        const giLogs = relatedLogs.filter(l => l.movementType === '261');

        if (grLogs.length > 0 && giLogs.length > 0) {
            const grDateStr = grLogs[0].postingDate;
            const giDateStr = giLogs[0].postingDate;
            if (grDateStr && giDateStr) {
                const grDate = new Date(grDateStr.replace(/\./g, '-'));
                const giDate = new Date(giDateStr.replace(/\./g, '-'));
                if (!isNaN(grDate.getTime()) && !isNaN(giDate.getTime())) {
                    if (grDate.getMonth() !== giDate.getMonth()) {
                        hasCrossMonthError = true;
                    }
                }
            }
        }

        return {
            ...order,
            materialLogs: relatedLogs,
            isUnfinished: isUnfinished || false,
            hasCrossMonthError
        };
    });
}

// 2. [중요] 상세 페이지에서 쓰는 함수 (이게 없어서 에러났음)
export async function getAnalyzedOrderById(id: string): Promise<AnalyzedOrder | undefined> {
    const orders = await getAnalyzedOrders();
    return orders.find(o => o.orderNumber === id);
}

// 3. 원본 헤더 데이터 (헤더 페이지용)
export async function getRawHeaders(): Promise<SapOrderHeader[]> {
    const rawHeaders = await readCsv<any>(HEADER_PATH);
    return rawHeaders.map(h => ({
        orderNumber: h['오더'] || '',
        plant: h['플랜트'],
        materialDescription: h['자재 내역'] || h['자재 내역_1'],
        systemStatus: h['시스템 상태'],
        basicStartDate: h['기본 시작일'],
        actualFinishDate: h['실제종료일'],
        orderType: h['오더 유형'],
        mrpController: h['MRP 관리자'],
        productionSupervisor: h['생산 감독자'],
        material: h['자재'] || h['자재_1'],
        basicEndDate: h['기본 종료일'] || h['기본 종료일_1'],
        orderQuantity: Number(h['오더 수량 (GMEIN)']?.replace(/,/g, '') || 0),
        confirmedYield: Number(h['확인된 수율 수량 (GMEIN)']?.replace(/,/g, '') || 0),
        deliveredQuantity: Number(h['납품 수량 (GMEIN)']?.replace(/,/g, '') || 0),
        unit: h['단위 (=GMEIN)'],
        productionVersion: h['생산 버전'],
        changeDate: h['변경일'],
        actualReleaseDate: h['릴리스일자(실제)'],
        plannedReleaseDate: h['계획된 릴리스일'],
        programRelease: h['프로그램 릴리스']
    }));
}

// 4. 원본 자재 데이터 (자재 페이지용)
export async function getRawMaterials(): Promise<SapMaterialDocument[]> {
    const rawMaterials = await readCsv<any>(MATERIAL_PATH);
    return rawMaterials.map(m => ({
        orderNumber: m['오더'] || m['오더_1'],
        material: m['자재'] || m['자재_1'],
        movementType: m['이동 유형'],
        postingDate: m['전기일'],
        quantity: Number(m['입력단위수량 (ERFME)']?.replace(/,/g, '') || 0),
        plant: m['플랜트'],
        materialDescription: m['자재 내역'],
        movementIndicator: m['자재이동 지시자'],
        unit: m['입력단위 (=ERFME)'],
        materialDocYear: m['자재 문서 연도'],
        materialDocNumber: m['자재 문서'],
        materialDocItem: m['자재 문서 항목'],
        storageLocation: m['저장 위치'],
        batch: m['배치'],
        debitCreditInd: m['차변/대변지시자'],
        amount: Number(m['금액(현지 통화) (WAERS)']?.replace(/,/g, '') || 0),
        currency: m['통화']
    }));
}