import { SavingsProduct } from 'types/savingsProducts';

export const filterSavingsProducts = (products: SavingsProduct[], monthlyAmount: number, term: number) => {
  return products.filter(product => {
    return (
      product.minMonthlyAmount <= monthlyAmount &&
      product.maxMonthlyAmount >= monthlyAmount &&
      product.availableTerms === term
    );
  });
};
