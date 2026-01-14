/**
 * 예상 수익 금액을 계산합니다.
 * 공식: 월 납입액 × 저축 기간 × (1 + 연이자율 × 0.5)
 *
 * @param monthlyAmount - 월 납입액
 * @param term - 저축 기간 (개월)
 * @param annualRate - 연 이자율 (퍼센트 단위, 예: 3.5)
 * @returns 예상 수익 금액
 */
export const calculateExpectedIncome = (monthlyAmount: number, term: number, annualRate = 0): number => {
  return monthlyAmount * term * (1 + annualRate * 0.01 * 0.5);
};

/**
 * 목표 금액과 예상 수익 금액의 차이를 계산합니다.
 *
 * @param targetAmount - 목표 금액
 * @param expectedIncome - 예상 수익 금액
 * @returns 목표 금액과의 차이 (양수면 목표 초과, 음수면 목표 미달)
 */
export const calculateTargetDiff = (targetAmount: number, expectedIncome: number): number => {
  return targetAmount - expectedIncome;
};

/**
 * 목표 금액 달성을 위한 추천 월 납입 금액을 계산합니다.
 * 1000원 단위로 반올림합니다.
 *
 * @param targetAmount - 목표 금액
 * @param term - 저축 기간 (개월)
 * @param annualRate - 연 이자율 (퍼센트 단위, 예: 3.5)
 * @returns 추천 월 납입 금액 (1000원 단위)
 */
export const calculateRecommendedMonthlyPayment = (targetAmount: number, term: number, annualRate = 0): number => {
  const rawAmount = targetAmount / (term * (1 + annualRate * 0.01 * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
};
