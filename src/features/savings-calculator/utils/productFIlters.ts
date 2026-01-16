import type { SavingsProduct } from '../api/api';

export const matchesPaymentRange = (amount: number | null) => (product: SavingsProduct) => {
  return amount ? product.minMonthlyAmount <= amount && product.maxMonthlyAmount >= amount : true;
};

export const matchesPeriod = (period: number | null) => (product: SavingsProduct) => {
  return period ? product.availableTerms === period : true;
};

export const byHighestAnnualRate = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;
