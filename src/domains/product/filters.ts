import { SavingsProduct } from 'api';

export function filterByMonthlyAmount(product: SavingsProduct, monthlyAmount: number | null | undefined) {
  if (monthlyAmount === null || monthlyAmount === undefined) {
    return true;
  }
  return product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount;
}

export function filterBySavingsTerm(product: SavingsProduct, selectedTerm: number | null | undefined) {
  if (selectedTerm === null || selectedTerm === undefined) {
    return true;
  }
  return product.availableTerms === selectedTerm;
}

export function orderByAnnualRate(a: SavingsProduct, b: SavingsProduct) {
  return b.annualRate - a.annualRate;
}
