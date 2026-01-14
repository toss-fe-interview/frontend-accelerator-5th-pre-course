import type { SavingsProduct } from '../types/savings';
import { roundToThousand } from './format';

/**
 * 예상 수익 금액 계산
 * @param monthlyAmount - 월 납입액
 * @param savingTerm - 저축 기간 (개월)
 * @param annualRate - 연 이자율 (%)
 * @returns 예상 수익 금액
 */
export function calculateExpectedAmount(monthlyAmount: number, savingTerm: number, annualRate: number): number {
  return Math.floor(monthlyAmount * savingTerm * (1 + annualRate / 100 * 0.5));
}

/**
 * 목표 금액과의 차이 계산
 * @param targetAmount - 목표 금액
 * @param expectedAmount - 예상 수익 금액
 * @returns 목표 금액과의 차이
 */
export function calculateDifference(targetAmount: number, expectedAmount: number): number {
  return targetAmount - expectedAmount;
}

/**
 * 추천 월 납입 금액 계산 (1,000원 단위 반올림)
 * @param targetAmount - 목표 금액
 * @param savingTerm - 저축 기간 (개월)
 * @param annualRate - 연 이자율 (%)
 * @returns 추천 월 납입 금액
 */
export function calculateRecommendedMonthlyAmount(
  targetAmount: number,
  savingTerm: number,
  annualRate: number,
): number {
  const rawAmount = targetAmount / (savingTerm * (1 + annualRate / 100 * 0.5));
  return roundToThousand(rawAmount);
}

/**
 * 연 이자율 기준 내림차순 정렬
 * @param products - 상품 목록
 * @returns 이자율 내림차순 정렬된 상품 목록
 */
export function sortByAnnualRate(products: SavingsProduct[]): SavingsProduct[] {
  return [...products].sort((a, b) => b.annualRate - a.annualRate);
}

/**
 * 상위 N개 상품 가져오기
 * @param products - 상품 목록
 * @param count - 가져올 상품 개수
 * @returns 상위 N개 상품
 */
export function getTopProducts(products: SavingsProduct[], count: number): SavingsProduct[] {
  return sortByAnnualRate(products).slice(0, count);
}