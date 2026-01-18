import { SavingsProduct } from 'api/savings-products/types';

type CalculateExpectedProfitParams = Pick<SavingsProduct, 'availableTerms' | 'annualRate'> & {
  monthlyPayment: number;
};

type CalculateSuggestMonthlyPaymentParams = Pick<SavingsProduct, 'availableTerms' | 'annualRate'> & {
  targetAmount: number;
};

export const calculateExpectedProfit = ({
  availableTerms,
  annualRate,
  monthlyPayment,
}: CalculateExpectedProfitParams) => {
  return monthlyPayment * availableTerms * (1 + annualRate * 0.5);
};

export const diff = (minuend: number, subtrahend: number) => {
  return minuend - subtrahend;
};

export const calculateSuggestMonthlyPayment = ({
  availableTerms,
  annualRate,
  targetAmount,
}: CalculateSuggestMonthlyPaymentParams) => {
  const result = targetAmount / (availableTerms * (1 + annualRate * 0.5));
  return Math.round(result / 1000) * 1000;
};
