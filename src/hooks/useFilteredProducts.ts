import { useMemo } from 'react';
import { SavingsProduct } from 'types/savings';

export function useFilteredProducts(
  products: SavingsProduct[],
  monthlyAmount: number,
  terms: number
): SavingsProduct[] {
  return useMemo(() => {
    if (monthlyAmount === 0) {
      return products;
    }

    return products.filter(product => {
      const isMonthlyAmountValid =
        monthlyAmount >= product.minMonthlyAmount &&
        monthlyAmount <= product.maxMonthlyAmount;
      const isTermsValid = product.availableTerms === terms;
      
      return isMonthlyAmountValid && isTermsValid;
    });
  }, [products, monthlyAmount, terms]);
}
