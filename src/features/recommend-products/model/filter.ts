import { SavingsProduct } from 'entities/savings-product/model/types';
import { validateRecommendedProducts } from './validator';

function getRecommendedProducts(products: SavingsProduct[], monthlyAmount: number, term: number) {
  return products
    .filter(product => validateRecommendedProducts(product, monthlyAmount, term))
    .sort((a, b) => b.annualRate - a.annualRate);
}

export { getRecommendedProducts };
