import { SavingsProduct } from 'entities/savings-product/model/types';

function getRecommendedProducts(products: SavingsProduct[], monthlyAmount: number, term: number) {
  return products
    .filter(product => {
      const isValidAmount = product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount;
      const isValidTerm = product.availableTerms === term;
      return isValidAmount && isValidTerm;
    })
    .sort((a, b) => b.annualRate - a.annualRate);
}

export { getRecommendedProducts };
