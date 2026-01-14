// 예상 수익 금액 계산
// 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
export const calculateExpectedProfit = (monthlyAmount: number, term: number, annualRate: number) => {
  return monthlyAmount * term * (1 + annualRate * 0.5);
}


// 목표 금액과의 차이 계산
// 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
export const calculateTargetAmountDifference = (targetAmount: number, expectedProfit: number) => {
  return targetAmount - expectedProfit;
}

// 추천 월 납입 금액 계산
// 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
// 1,000원 단위로 반올림
export const calculateRecommendedMonthlyAmount = (targetAmount: number, term: number, annualRate: number) => {
 const recommendedMonthlyAmount = targetAmount / (term * (1 + annualRate * 0.5));
 return Math.round(recommendedMonthlyAmount / 1000) * 1000;
}