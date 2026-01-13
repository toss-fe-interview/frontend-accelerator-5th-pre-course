/**
 * 예상 수익 금액 계산
 * 공식: 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
 */
export function calculateExpectedAmount(monthlyAmount: number, availableTerms: number, annualRate: number) {
  const rate = annualRate / 100;
  return monthlyAmount * availableTerms * (1 + rate * 0.5);
}

/**
 * 목표 금액과의 차이 계산
 * 공식: 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
 */
export function calculateDifference(targetAmount: number, expectedAmount: number) {
  return targetAmount - expectedAmount;
}

/**
 * 추천 월 납입 금액 계산
 * 공식: 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
 * 1,000원 단위로 반올림
 */
export function calculateRecommendedMonthlyAmount(targetAmount: number, availableTerms: number, annualRate: number) {
  const rate = annualRate / 100;
  const rawAmount = targetAmount / (availableTerms * (1 + rate * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
}
