import type { SavingsProduct } from '../types';

interface FilterCriteria {
  monthlyDeposit: number;
  period: number;
}

export function filterSavingsProducts(products: SavingsProduct[], criteria: FilterCriteria): SavingsProduct[] {
  const { monthlyDeposit, period } = criteria;

  return products.filter(product => {
    const isValidAmount = monthlyDeposit > product.minMonthlyAmount && monthlyDeposit < product.maxMonthlyAmount;

    const isValidPeriod = product.availableTerms === period;

    return isValidAmount && isValidPeriod;
  });
}

export function getTopRateProducts(products: SavingsProduct[], count: number): SavingsProduct[] {
  return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
}

export function calculateExpectedProfit(monthlyDeposit: number, period: number, annualRate: number): number {
  return monthlyDeposit * period * (1 + annualRate * 0.5);
}

export function calculateGoalDifference(goalAmount: number, expectedProfit: number): number {
  return goalAmount - expectedProfit;
}

export function calculateRecommendedDeposit(goalAmount: number, period: number, annualRate: number): number {
  const rawAmount = goalAmount / (period * (1 + annualRate * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
}

// - 예상 수익 금액
//     - 공식: `최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)`
// - 목표 금액과의 차이
//     - 공식: `목표 금액과의 차이 = 목표 금액 - 예상 수익 금액`
// - 추천 월 납입 금액
//     - 공식: `월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))`
//     - 1,000원 단위로 반올림
