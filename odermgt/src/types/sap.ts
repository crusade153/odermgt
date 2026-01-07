// src/types/sap.ts

// 1. SAP 오더 헤더 정보 (header.csv)
export interface SapOrderHeader {
    orderNumber: string;          // 오더 번호
    plant: string;                // 플랜트
    materialDescription: string;  // 자재 내역
    systemStatus: string;         // 시스템 상태 (REL, DLV, TECO 등)
    basicStartDate: string;       // 기본 시작일
    actualFinishDate: string;     // 실제 종료일
    orderType: string;            // 오더 유형
    mrpController: string;        // MRP 관리자
    productionSupervisor: string; // 생산 감독자
    material: string;             // 자재 번호
    basicEndDate: string;         // 기본 종료일
    orderQuantity: number;        // 오더 수량
    confirmedYield: number;       // 확인된 수율
    deliveredQuantity: number;    // 납품 수량
    unit: string;                 // 단위
    productionVersion: string;    // 생산 버전
    changeDate: string;           // 변경일
    actualReleaseDate: string;    // 실제 릴리스일
    plannedReleaseDate: string;   // 계획된 릴리스일
    programRelease: string;       // 프로그램 릴리스
}

// 2. SAP 자재 문서 정보 (material.csv)
export interface SapMaterialDocument {
    orderNumber: string;          // 오더 번호 (연결고리)
    material: string;             // 자재 번호
    movementType: string;         // 이동 유형 (101: 입고, 261: 투입 등)
    postingDate: string;          // 전기일
    quantity: number;             // 수량
    plant: string;                // 플랜트
    materialDescription: string;  // 자재 내역
    movementIndicator: string;    // 자재이동 지시자
    unit: string;                 // 단위
    materialDocYear: string;      // 자재 문서 연도
    materialDocNumber: string;    // 자재 문서 번호
    materialDocItem: string;      // 자재 문서 항목
    storageLocation: string;      // 저장 위치
    batch: string;                // 배치
    debitCreditInd: string;       // 차변/대변 지시자
    amount: number;               // 금액
    currency: string;             // 통화
}

// 3. 분석된 오더 데이터 (앱에서 사용하는 최종 형태)
// SapOrderHeader를 상속받고, 추가 분석 필드를 포함합니다.
export interface AnalyzedOrder extends SapOrderHeader {
    materialLogs: SapMaterialDocument[]; // 관련 자재 문서들
    isUnfinished: boolean;               // 미마감 여부 (REL 상태인데 DLV/TECO 없음)
    hasCrossMonthError: boolean;         // 월 불일치 여부 (입고월 != 투입월)
    explanation?: string;                // 👈 소명 사유 (Supabase 연동 시 사용, 없으면 undefined)
}