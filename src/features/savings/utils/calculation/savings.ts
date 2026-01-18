import { SavingsProduct } from 'features/savings/types/savingsProduct';
import { SavingsValues } from 'features/savings/types/savingsValues';

const roundThousand = (number: number) => {
  return Math.round(number / 1000) * 1000;
};

const calculateEstimatedEarningsAmount = (monthlyPaymentAmount: number, savingsPeriod: number, annualRate: number) => {
  const result = monthlyPaymentAmount * savingsPeriod * (1 + annualRate * 0.01 * 0.5);

  return result;
};

const calculateDifferenceWithTargetAmount = (targetAmount: number, estimatedEarginsAmount: number) => {
  const result = targetAmount - estimatedEarginsAmount;

  return result;
};

const calculateRecommendedMonthlyPayment = (targetAmount: number, savingsPeriod: number, annualRate: number) => {
  const result = targetAmount / (savingsPeriod * (1 + annualRate * 0.01 * 0.5));

  return roundThousand(result);
};

export const calculateSavingsResults = (savingsProduct: SavingsProduct, savingsValues: SavingsValues) => {
  const estimatedEarnings = calculateEstimatedEarningsAmount(
    savingsValues.monthlyPaymentAmount,
    savingsValues.savingsPeriod,
    savingsProduct.annualRate
  );

  const diffWithTargetAmount = calculateDifferenceWithTargetAmount(savingsValues.targetAmount, estimatedEarnings);

  const recommendedMonthlyPayment = calculateRecommendedMonthlyPayment(
    savingsValues.targetAmount,
    savingsValues.savingsPeriod,
    savingsProduct.annualRate
  );

  return { estimatedEarnings, diffWithTargetAmount, recommendedMonthlyPayment };
};
