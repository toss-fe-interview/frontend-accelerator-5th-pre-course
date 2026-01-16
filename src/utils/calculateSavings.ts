import { percentageToDecimal } from 'utils/format';

interface SavingsCalculationParams {
  monthlyAmount: number;
  savingsTerm: number;
  targetAmount: number;
  annualRate: number;
}

interface SavingsCalculationResult {
  expectedProfit: number;
  differenceProfit: number;
  recommendedMonthlyAmount: number;
}

export function calculateSavings({
  monthlyAmount,
  savingsTerm,
  targetAmount,
  annualRate,
}: SavingsCalculationParams): SavingsCalculationResult {
  const rate = percentageToDecimal(annualRate);
  const interestMultiplier = 1 + rate * 0.5;

  const expectedProfit = monthlyAmount * savingsTerm * interestMultiplier;
  const differenceProfit = targetAmount - expectedProfit;
  const recommendedMonthlyAmount = targetAmount / (savingsTerm * interestMultiplier);

  return {
    expectedProfit,
    differenceProfit,
    recommendedMonthlyAmount,
  };
}
