import type { SavingsProduct } from '../types';

interface FilterCriteria {
  monthlyDeposit: number;
  period: number;
}

export function 적금상품필터링(products: SavingsProduct[], criteria: FilterCriteria): SavingsProduct[] {
  const { monthlyDeposit, period } = criteria;

  return products.filter(product => {
    const isValidAmount = monthlyDeposit > product.minMonthlyAmount && monthlyDeposit < product.maxMonthlyAmount;

    const isValidPeriod = product.availableTerms === period;

    return isValidAmount && isValidPeriod;
  });
}

export function 추천상품필터링(products: SavingsProduct[]): SavingsProduct[] {
  const count = 2;
  return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
}
