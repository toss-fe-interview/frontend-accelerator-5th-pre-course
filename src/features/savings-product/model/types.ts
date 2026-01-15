import { SavingsProduct } from 'entities/savings-product/model/types';

interface SavingsProductFilter {
  minAnnualRate?: number;
  maxAnnualRate?: number;
  monthlyAmount?: number;
  term?: number;
}

function filterSavingsProducts(products: SavingsProduct[], filter: SavingsProductFilter): SavingsProduct[] {
  return products.filter(product => {
    if (filter.minAnnualRate !== undefined && product.annualRate < filter.minAnnualRate) {
      return false;
    }
    if (filter.maxAnnualRate !== undefined && product.annualRate > filter.maxAnnualRate) {
      return false;
    }
    if (filter.monthlyAmount !== undefined) {
      if (product.minMonthlyAmount > filter.monthlyAmount || product.maxMonthlyAmount < filter.monthlyAmount) {
        return false;
      }
    }
    if (filter.term !== undefined && product.availableTerms !== filter.term) {
      return false;
    }
    return true;
  });
}

export type { SavingsProductFilter };
export { filterSavingsProducts };
