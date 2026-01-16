import { percentageToDecimal } from 'utils/format';

interface SavingsCalculationParams {
  monthlyAmount: number;
  savingsTerm: number;
  targetAmount: number;
  annualRate: number;
}

export const calculateExpectedProfit = ({
  monthlyAmount,
  savingsTerm,
  annualRate,
}: Pick<SavingsCalculationParams, 'monthlyAmount' | 'savingsTerm' | 'annualRate'>) => {
  const rate = percentageToDecimal(annualRate);
  return monthlyAmount * savingsTerm * (1 + rate * 0.5);
};

export const calculateDifferenceProfit = ({
  targetAmount,
  expectedProfit,
}: {
  targetAmount: number;
  expectedProfit: number;
}) => {
  return targetAmount - expectedProfit;
};

export const calculateRecommendedMonthlyAmount = ({
  targetAmount,
  savingsTerm,
  annualRate,
}: Pick<SavingsCalculationParams, 'targetAmount' | 'savingsTerm' | 'annualRate'>) => {
  const rate = percentageToDecimal(annualRate);
  return Math.round(targetAmount / (savingsTerm * (1 + rate * 0.5)));
};
