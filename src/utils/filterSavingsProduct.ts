import { SavingProduct } from 'queries/types';

export const filterByTerm = (product: SavingProduct, term: number) => {
  return product.availableTerms === term;
};

export const filterByMonthlyAmount = (product: SavingProduct, monthlyAmount: number | null) => {
  if (!monthlyAmount) {
    return true;
  }

  return product.minMonthlyAmount <= monthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
};
