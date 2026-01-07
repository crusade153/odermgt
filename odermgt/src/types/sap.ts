// 1. SAP 오더 헤더 정보 (header.csv)
export interface SapOrderHeader {
    orderNumber: string;
    plant: string;
    materialDescription: string;
    systemStatus: string;
    basicStartDate: string;
    actualFinishDate: string;
    orderType: string;
    mrpController: string;
    productionSupervisor: string;
    material: string;
    basicEndDate: string;
    orderQuantity: number;
    confirmedYield: number;
    deliveredQuantity: number;
    unit: string;
    productionVersion: string;
    changeDate: string;
    actualReleaseDate: string;
    plannedReleaseDate: string;
    programRelease: string;
}

// 2. SAP 자재 문서 정보 (material.csv)
export interface SapMaterialDocument {
    orderNumber: string;
    material: string;
    movementType: string;
    postingDate: string;
    quantity: number;
    plant: string;
    materialDescription: string;
    movementIndicator: string;
    unit: string;
    materialDocYear: string;
    materialDocNumber: string;
    materialDocItem: string;
    storageLocation: string;
    batch: string;
    debitCreditInd: string;
    amount: number;
    currency: string;
}

// 3. 분석된 오더 데이터
export interface AnalyzedOrder extends SapOrderHeader {
    materialLogs: SapMaterialDocument[];
    isUnfinished: boolean;
    hasCrossMonthError: boolean;
    explanation?: string; // 👈 이게 꼭 있어야 합니다!
}