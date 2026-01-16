import { SavingsProduct } from 'entities/savings/model/types';

import { SavingsCalculatorFormState } from 'features/savings-calculator/model/types';

export const isAvailableProduct = (args: {
  savingsProduct: SavingsProduct;
  formState: SavingsCalculatorFormState;
}): boolean => {
  const { savingsProduct, formState } = args;
  const { monthlyAmount, term } = formState;
  const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;

  const isMonthlyAmountInRange = minMonthlyAmount <= monthlyAmount && maxMonthlyAmount >= monthlyAmount;
  const isTermMatched = availableTerms === term;

  return isMonthlyAmountInRange && isTermMatched;
};
