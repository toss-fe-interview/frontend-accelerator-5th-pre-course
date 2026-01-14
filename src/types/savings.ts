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