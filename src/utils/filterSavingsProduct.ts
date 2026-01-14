import { SavingsCalculatorFormState } from 'types/SavingsCalculatorFormState';
import { SavingsProduct } from 'types/SavingsProduct.type';

export const filterSavingsProduct = (savingsProduct: SavingsProduct, formState: SavingsCalculatorFormState): boolean =>
  savingsProduct.minMonthlyAmount <= formState.monthlyAmount &&
  savingsProduct.maxMonthlyAmount >= formState.monthlyAmount &&
  savingsProduct.availableTerms === formState.term;
