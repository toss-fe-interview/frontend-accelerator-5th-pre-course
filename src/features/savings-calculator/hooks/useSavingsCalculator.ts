import { useMemo } from 'react';
import type { SavingsFormState, SavingsProduct } from 'shared/types';

const RECOMMENDED_PRODUCTS_COUNT = 2;

interface UseSavingsCalculatorParams {
  products: SavingsProduct[];
  formState: SavingsFormState;
  selectedProductId: string | null;
}

export function useSavingsCalculator({ products, formState, selectedProductId }: UseSavingsCalculatorParams) {
  const filteredProducts = useMemo(() => {
    const { monthlyAmount, term } = formState;

    if (monthlyAmount === null) {
      return products;
    }

    return products.filter(
      product =>
        product.minMonthlyAmount < monthlyAmount &&
        monthlyAmount < product.maxMonthlyAmount &&
        product.availableTerms === term
    );
  }, [products, formState]);

  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

  const recommendedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, RECOMMENDED_PRODUCTS_COUNT);
  }, [filteredProducts]);

  return { filteredProducts, selectedProduct, recommendedProducts };
}
