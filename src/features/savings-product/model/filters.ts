import { SavingsProduct } from 'entities/savings-product/model/types';

export const byMonthlyAmount = (amount: number) => (product: SavingsProduct) =>
  product.minMonthlyAmount <= amount && product.maxMonthlyAmount >= amount;

export const byTerm = (term: number) => (product: SavingsProduct) => product.availableTerms === term;

export const byAnnualRateRange = (min?: number, max?: number) => (product: SavingsProduct) =>
  (min === undefined || product.annualRate >= min) && (max === undefined || product.annualRate <= max);
