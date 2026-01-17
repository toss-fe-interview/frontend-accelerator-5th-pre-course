import { SavingProduct } from 'queries/types';

export const filterSavingsProduct = (product: SavingProduct, term: number, monthlyAmount?: number) => {
  const isSameTerm = product.availableTerms === term;

  if (!isSameTerm) return false;

  if (!monthlyAmount) return true;

  const isMonthlyAmountInRange =
    product.minMonthlyAmount <= monthlyAmount && monthlyAmount <= product.maxMonthlyAmount;

  return isMonthlyAmountInRange;
};
