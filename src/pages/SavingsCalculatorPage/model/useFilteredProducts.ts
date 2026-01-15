import { useSavingsProducts } from 'features/savings-product/api/useSavingsProducts';
import { SavingsProductFilter } from 'features/savings-product/model/filters';
import { useMemo } from 'react';
import { RECOMMENDED_PRODUCTS_COUNT } from './constants';
import { getRecommendedProducts } from 'features/recommend-products/model/filter';

export function useFilteredProducts(filter: SavingsProductFilter) {
  const { data: products, isLoading, error } = useSavingsProducts(filter);

  const recommendedProducts = useMemo(() => {
    if (!filter.monthlyAmount || !filter.term) {
      return [];
    }
    if (filter.monthlyAmount <= 0) {
      return [];
    }
    return getRecommendedProducts(products, filter.monthlyAmount, filter.term).slice(0, RECOMMENDED_PRODUCTS_COUNT);
  }, [products, filter.monthlyAmount, filter.term]);

  return {
    products,
    recommendedProducts,
    isLoading,
    error,
  };
}
