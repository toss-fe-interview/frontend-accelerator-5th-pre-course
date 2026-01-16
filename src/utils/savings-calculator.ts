/**
 *
 * @param monthlyAmount 월 납입액
 * @param term 저축 기간
 * @param annualRate 연이자율
 * @returns 예상 수익 금액
 */
export const calculateExpectedProfit = (monthlyAmount: number, term: number, annualRate: number) => {
  return monthlyAmount * term * (1 + annualRate * 0.5);
};

/**
 *
 * @param targetAmount 목표 금액
 * @param expectedProfit 예상 수익 금액
 * @returns 목표 금액과의 차이
 */
export const calculateTargetDifference = (targetAmount: number, expectedProfit: number) => {
  return targetAmount - expectedProfit;
};

/**
 *
 * @param targetAmount 목표 금액
 * @param term 저축 기간
 * @param annualRate 연이자율
 * @returns 추천 월 납입 금액
 */
export const calculateRecommendedMonthlyAmount = (targetAmount: number, term: number, annualRate: number) => {
  return targetAmount / (term * (1 + annualRate * 0.5));
};
