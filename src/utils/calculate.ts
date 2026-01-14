import { SavingsProduct } from 'api/savings-products/types';

type CalculateExpecteProfitParams = Pick<SavingsProduct, 'availableTerms' | 'annualRate'> & {
  monthlyPayment: number;
};

interface CalculateDiffTargetAmountParams {
  targetAmount: number;
  expecteProfit: number;
}

type CalculateSuggestMonthlyPaymentParams = Pick<SavingsProduct, 'availableTerms' | 'annualRate'> & {
  targetAmount: number;
};

export const calculateExpecteProfit = ({
  availableTerms,
  annualRate,
  monthlyPayment,
}: CalculateExpecteProfitParams) => {
  return monthlyPayment * availableTerms * (1 + annualRate * 0.5);
};

export const calculateDiffTargetAmount = ({ targetAmount, expecteProfit }: CalculateDiffTargetAmountParams) => {
  return targetAmount - expecteProfit;
};

export const calculateSuggestMonthlyPayment = ({
  availableTerms,
  annualRate,
  targetAmount,
}: CalculateSuggestMonthlyPaymentParams) => {
  const result = targetAmount / (availableTerms * (1 + annualRate * 0.5));
  return Math.round(result / 1000) * 1000;
};
