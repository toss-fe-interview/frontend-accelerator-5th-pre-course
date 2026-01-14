/**
 * 적금 상품 타입 정의
 */
export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number; // 연 이자율
  minMonthlyAmount: number; // 최소 월 납입액
  maxMonthlyAmount: number; // 최대 월 납입액
  availableTerms: number; // 저축 기간 (개월)
}

/**
 * 사용자 입력 폼 데이터
 */
export interface SavingsFormInput {
  targetAmount: number; // 목표 금액
  monthlyAmount: number; // 월 납입액
  savingTerm: number; // 저축 기간 (개월)
}

/**
 * 상품 필터링 조건
 */
export interface ProductFilterCriteria {
  monthlyAmount?: number; // 월 납입액 (옵셔널)
  savingTerm?: number; // 저축 기간 (옵셔널)
}