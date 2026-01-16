import type { SavingsProduct } from 'types';
import { isInRange, percentageToFloat } from 'utils/number';

export const get반기예상연이자율 = (annualRate: number) => 1 + percentageToFloat(annualRate) * 0.5;

export const hasMonthlyAmountInRange = (monthlyAmount: number) => (savingsProduct: SavingsProduct) =>
  isInRange(monthlyAmount, savingsProduct.minMonthlyAmount, savingsProduct.maxMonthlyAmount);

export const hasTermMatch = (term: number) => (savingsProduct: SavingsProduct) =>
  term === savingsProduct.availableTerms;
