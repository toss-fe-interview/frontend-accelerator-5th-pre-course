import { SavingsProduct } from 'type';

export const isWithinAmountRange = (product: SavingsProduct, monthlyAmount: number) =>
  product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount;

export const matchesTerm = (product: SavingsProduct, term: number) => product.availableTerms === term;
