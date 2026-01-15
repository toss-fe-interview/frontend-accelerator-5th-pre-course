import { calculateDifference, calculateExpectedAmount, calculateRecommendedMonthlyAmount } from 'shared/utils/savings';

export function useSavingsCalculation({
  targetAmount,
  monthlyAmount,
  availableTerms,
  annualRate,
}: {
  targetAmount: number;
  monthlyAmount: number;
  availableTerms: number;
  annualRate: number;
}) {
  const expectedAmount = calculateExpectedAmount(monthlyAmount, availableTerms, annualRate);
  const difference = calculateDifference(targetAmount, expectedAmount);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(targetAmount, availableTerms, annualRate);

  return { expectedAmount, difference, recommendedMonthlyAmount };
}
