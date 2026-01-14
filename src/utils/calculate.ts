import { SavingsProductItem } from 'services/savings';

export const calculateSavingsResult = (goal: number, monthlyPay: number, selectedSavings: SavingsProductItem) => {
  const { availableTerms, annualRate } = selectedSavings;
  const expectedProfit = monthlyPay * availableTerms * (1 + annualRate * 0.5);
  const goalResultDiff = expectedProfit - goal;
  const recommendedMonthlyPay = goal / (availableTerms * (1 + annualRate * 0.5));
  return { expectedProfit, goalResultDiff, recommendedMonthlyPay };
};
