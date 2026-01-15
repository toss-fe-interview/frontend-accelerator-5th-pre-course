import { SavingsProduct } from 'entities/savings-product/model/types';

function validateAmount(product: SavingsProduct, monthlyAmount: number) {
  return product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount;
}

function validateTerm(product: SavingsProduct, term: number) {
  return product.availableTerms === term;
}

function validateRecommendedProducts(product: SavingsProduct, monthlyAmount: number, term: number) {
  return validateAmount(product, monthlyAmount) && validateTerm(product, term);
}

export { validateRecommendedProducts };
