import { SavingsProduct } from 'model/types';
import { ChangeEvent } from 'react';
import { isInRange } from 'utils/boolean';
import { interestFactor, numericFormatter } from 'utils/number';

export const calcExpectProfit = ({
  selectedProduct,
  monthlyAmount,
  period,
}: {
  selectedProduct: SavingsProduct | null;
  monthlyAmount: string;
  period: number;
}) => {
  return selectedProduct
    ? Math.round(numericFormatter(monthlyAmount) * period * interestFactor(selectedProduct?.annualRate, 0.5))
    : 0;
};

export const getMatchedSavingsProducts = ({
  savingsProducts,
  monthlyAmount,
  period,
}: {
  savingsProducts: SavingsProduct[];
  monthlyAmount: string;
  period: number;
}) => {
  return savingsProducts.filter(product => {
    const numericGoalAmount = numericFormatter(monthlyAmount);
    const monthlyAmountCondition = isInRange(numericGoalAmount, product.minMonthlyAmount, product.maxMonthlyAmount);
    const isSamePeriodAndTerms = period === product.availableTerms;
    return monthlyAmountCondition && isSamePeriodAndTerms;
  });
};

export const calcDiffAmount = ({ goalAmount, expectedProfit }: { goalAmount: number; expectedProfit: number }) => {
  return goalAmount - expectedProfit;
};

export const calcRecommendAmountForMonth = ({
  selectedProduct,
  goalAmount,
  period,
}: {
  selectedProduct: SavingsProduct | null;
  goalAmount: string;
  period: number;
}) => {
  return selectedProduct
    ? Math.round(
        numericFormatter(goalAmount) / (period * (1 + interestFactor(selectedProduct?.annualRate, 0.5))) / 1000
      ) * 1000
    : 0;
};

export const sortByRate = <T extends { annualRate: number }>(base: T[], order: 'asc' | 'desc' = 'asc') => {
  if (order === 'desc') {
    return [...base].sort((a, b) => b.annualRate - a.annualRate);
  } else {
    return [...base].sort((a, b) => a.annualRate - b.annualRate);
  }
};
export const slicer = <T>(list: T[], { offset, limit }: { offset: number; limit: number }) => {
  return list.slice(offset, limit);
};

export const getRecommendedProduct = ({
  sortBy,
  filter,
}: {
  sortBy: SavingsProduct[];
  filter: { offset: number; limit: number };
}) => {
  return sortBy.slice(filter.offset, filter.limit);
};

export const handleAmountChange = (e: ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
  const value = e.target.value;
  const numericValue = numericFormatter(value);
  if (isNaN(numericValue)) {
    return;
  }
  onChange(numericValue.toLocaleString());
};
