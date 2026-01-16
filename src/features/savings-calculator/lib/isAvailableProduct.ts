import { SavingsProduct } from 'entities/savings/model/types';

import { SavingsCondition } from 'features/savings-calculator/model/types';

export const isAvailableProduct = (args: { savingsProduct: SavingsProduct; condition: SavingsCondition }): boolean => {
  const { savingsProduct, condition } = args;
  const { monthlyAmount, term } = condition;
  const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;

  const isMonthlyAmountInRange = minMonthlyAmount <= monthlyAmount && maxMonthlyAmount >= monthlyAmount;
  const isTermMatched = availableTerms === term;

  return isMonthlyAmountInRange && isTermMatched;
};
