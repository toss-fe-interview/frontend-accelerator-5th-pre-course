import { CalculationResult, CalculateSavingsParams } from 'types/savings';

export function calculateExpectedAmount(monthlyAmount: number, terms: number, annualRate: number): number {
  return monthlyAmount * terms * (1 + annualRate * 0.01 * 0.5);
}

export function calculateDifference(targetAmount: number, expectedAmount: number): number {
  return targetAmount - expectedAmount;
}

export function calculateRecommendedMonthlyAmount(targetAmount: number, terms: number, annualRate: number): number {
  const amount = targetAmount / (terms * (1 + annualRate * 0.01 * 0.5));
  return Math.round(amount / 1000) * 1000;
}

export function calculateSavingsResult({ formData, annualRate }: CalculateSavingsParams): CalculationResult {
  const expectedAmount = calculateExpectedAmount(formData.monthlyAmount, formData.terms, annualRate);
  const difference = calculateDifference(formData.targetAmount, expectedAmount);
  const recommendMonthlyAmount = calculateRecommendedMonthlyAmount(formData.targetAmount, formData.terms, annualRate);

  return {
    expectedAmount,
    difference,
    recommendMonthlyAmount,
  };
}
