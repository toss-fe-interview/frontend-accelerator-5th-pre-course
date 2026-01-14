interface CalculationInput {
  monthlyAmount: number;
  savingPeriod: number;
  annualRate: number;
  targetAmount: number;
}

export interface CalculationResult {
  expectedAmount: number; // 예상 수익 금액
  differenceFromTarget: number; // 목표 금액과의 차이
  recommendedMonthlyAmount: number; // 추천 월 납입 금액
}

// 예상 수익 금액 계산
// 공식: 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
export const calculateExpectedAmount = (monthlyAmount: number, savingPeriod: number, annualRate: number): number => {
  return Math.floor(monthlyAmount * savingPeriod * (1 + (annualRate / 100) * 0.5));
};

// 목표 금액과의 차이 계산
// 공식: 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
export const calculateDifference = (targetAmount: number, expectedAmount: number): number => {
  return targetAmount - expectedAmount;
};

// 추천 월 납입 금액 계산
// 공식: 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
// 1,000원 단위로 반올림
export const calculateRecommendedMonthly = (targetAmount: number, savingPeriod: number, annualRate: number): number => {
  const rawAmount = targetAmount / (savingPeriod * (1 + (annualRate / 100) * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
};

// 전체 계산 결과
export const calculateSavingsResult = (input: CalculationInput): CalculationResult => {
  const { monthlyAmount, savingPeriod, annualRate, targetAmount } = input;

  const expectedAmount = calculateExpectedAmount(monthlyAmount, savingPeriod, annualRate);
  const differenceFromTarget = calculateDifference(targetAmount, expectedAmount);
  const recommendedMonthlyAmount = calculateRecommendedMonthly(targetAmount, savingPeriod, annualRate);

  return {
    expectedAmount,
    differenceFromTarget,
    recommendedMonthlyAmount,
  };
};
