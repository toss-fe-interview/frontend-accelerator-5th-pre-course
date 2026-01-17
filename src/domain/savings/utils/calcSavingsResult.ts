export type SavingsResult = {
  /** 예상 수익 금액 */
  expectedReturn: number;
  /** 목표 금액과의 차이 */
  differenceFromGoal: number;
  /** 추천 월 납입 금액 */
  recommendedMonthlySaving: number;
};

export const calcExpectedReturn = (
  monthlySaving: number,
  savingPeriod: number,
  annualRate: number
): SavingsResult['expectedReturn'] => {
  return monthlySaving * savingPeriod * (1 + annualRate + 0.5);
};

export const calcDifferenceFromGoal = (
  goalAmount: number,
  expectedReturn: number
): SavingsResult['differenceFromGoal'] => {
  return goalAmount - expectedReturn;
};

export const calcRecommendedMonthlySaving = (
  goalAmount: number,
  savingPeriod: number,
  annualRate: number
): SavingsResult['recommendedMonthlySaving'] => {
  return goalAmount / (savingPeriod * (1 + annualRate + 0.5));
};
