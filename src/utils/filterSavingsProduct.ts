import { SavingProduct } from 'queries/types';

export const filterSavingsProduct = (product: SavingProduct, term: number, monthlyAmount?: number) => {
  const isSameTerm = product.availableTerms === term;
  const isMonthlyAmountInRange = monthlyAmount
    ? product.minMonthlyAmount <= monthlyAmount && monthlyAmount <= product.maxMonthlyAmount
    : true;
  return isSameTerm && isMonthlyAmountInRange;
};
