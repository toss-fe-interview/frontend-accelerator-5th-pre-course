import { CalculateSavingsParams } from 'types/savings';
import { CalculationResult } from 'types/savings';

export const calculateSavingsResult =({
    targetAmount,
    monthlyAmount,
    terms,
    annualRate,
  }: CalculateSavingsParams) : CalculationResult => {
    const expectedAmount = monthlyAmount * terms * (1 + annualRate * 0.01 * 0.5);
    const difference = targetAmount - expectedAmount;
    const recommendMonthlyAmount = Math.round(targetAmount / (terms * (1 + annualRate * 0.01 * 0.5)) / 1000) * 1000;
  
    return { expectedAmount, difference, recommendMonthlyAmount };
  }
