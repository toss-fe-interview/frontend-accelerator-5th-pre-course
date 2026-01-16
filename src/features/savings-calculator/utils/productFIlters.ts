import type { SavingsProduct } from '../api/api';

export const matchesPaymentRange = (amount: number | null) => (product: SavingsProduct) => {
  return amount == null || (product.minMonthlyAmount <= amount && product.maxMonthlyAmount >= amount);
};

export const matchesPeriod = (period: number | null) => (product: SavingsProduct) => {
  return period == null || product.availableTerms === period;
};

export const byHighestAnnualRate = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;
