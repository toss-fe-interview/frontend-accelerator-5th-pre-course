import { SavingsProduct } from './savings-products.dto';
import { SavingsCalculatorTerm, SavingsFilter } from '../types/saving-filter-form';

export function filterSavingsProducts(products: SavingsProduct[], filter: SavingsFilter): SavingsProduct[] {
  const { monthlyPayment, term } = filter;

  return products
    .filter(product => monthlyPayment == null || isMonthlyPaymentInRangeProduct(product, { monthlyPayment }))
    .filter(product => term == null || isTermMatchProduct(product, { term }));
}

function isMonthlyPaymentInRangeProduct(product: SavingsProduct, filter: { monthlyPayment: number }) {
  return product.minMonthlyAmount <= filter.monthlyPayment && filter.monthlyPayment <= product.maxMonthlyAmount;
}

function isTermMatchProduct(product: SavingsProduct, filter: { term: SavingsCalculatorTerm }) {
  return product.availableTerms === filter.term;
}
