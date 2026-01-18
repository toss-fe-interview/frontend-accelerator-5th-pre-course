import { SavingsProduct } from 'types/savings';

export const filterSavingsProducts = (products: SavingsProduct[], monthlyAmount: number, terms: number): SavingsProduct[] => {
  if (monthlyAmount === 0) {
    return products;
  }
  return products.filter(product => {
    const isMonthlyAmountValid = monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
    const isTermsValid = product.availableTerms === terms;
    return isMonthlyAmountValid && isTermsValid;
  });
};