import { SavingsCalculatorFormState } from 'types/SavingsCalculatorFormState';
import { SavingsProduct } from 'types/SavingsProduct.type';

export const filterSavingsProduct = (args: {
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
