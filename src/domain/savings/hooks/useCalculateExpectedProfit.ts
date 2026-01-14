import { SavingsResponse } from 'domain/savings/api/type';

interface Params {
  saving: SavingsResponse | null;
  goalAmount?: number;
  monthlyAmount?: number;
}

export const useCalculateExpectedProfit = ({ saving, goalAmount, monthlyAmount }: Params) => {
  const canCalculateExpectedProfit = saving && monthlyAmount;

  const canCalculateDiffBetweenGoalAndExpectedProfit = canCalculateExpectedProfit && goalAmount;

  const canCalculateRecommendedMonthlyAmount = saving && goalAmount;

  const calculateExpectedProfit = ({
    annualRate,
    availableTerms,
    monthlyAmount,
  }: {
    annualRate: number;
    availableTerms: number;
    monthlyAmount: number;
  }) => {
    return Math.round(monthlyAmount * availableTerms * (1 + annualRate * 0.5));
  };

  const calculateDiffBetweenGoalAndExpectedProfit = ({
    goalAmount,
    expectedProfit,
  }: {
    goalAmount: number;
    expectedProfit: number;
  }) => {
    return goalAmount - expectedProfit;
  };

  const calculateRecommendedMonthlyAmount = ({
    goalAmount,
    annualRate,
    availableTerms,
  }: {
    goalAmount: number;
    annualRate: number;
    availableTerms: number;
  }) => {
    return Math.round(goalAmount / (availableTerms * (1 + annualRate * 0.5)));
  };

  const getExpectedProfit = () => {
    if (!canCalculateExpectedProfit) {
      return null;
    }

    return calculateExpectedProfit({
      annualRate: saving.annualRate,
      availableTerms: saving.availableTerms,
      monthlyAmount,
    });
  };

  const getDiffBetweenGoalAndExpectedProfit = () => {
    if (!canCalculateDiffBetweenGoalAndExpectedProfit) {
      return null;
    }
    const expectedProfit = calculateExpectedProfit({
      annualRate: saving.annualRate,
      availableTerms: saving.availableTerms,
      monthlyAmount,
    });
    return calculateDiffBetweenGoalAndExpectedProfit({ goalAmount, expectedProfit });
  };

  const getRecommendedMonthlyAmount = () => {
    if (!canCalculateRecommendedMonthlyAmount) {
      return null;
    }
    return calculateRecommendedMonthlyAmount({
      goalAmount,
      annualRate: saving.annualRate,
      availableTerms: saving.availableTerms,
    });
  };

  return {
    getExpectedProfit,
    getDiffBetweenGoalAndExpectedProfit,
    getRecommendedMonthlyAmount,
    canCalculateExpectedProfit,
    canCalculateDiffBetweenGoalAndExpectedProfit,
    canCalculateRecommendedMonthlyAmount,
  };
};
