import { useQuery } from '@tanstack/react-query';
import { getSavingsProducts } from 'entities/savings-product/api/savingsProductApi';
import { filterSavingsProducts, SavingsProductFilter } from '../model/types';
import { useMemo } from 'react';

export function useSavingsProducts(filter: SavingsProductFilter) {
  const query = useQuery({
    queryKey: ['savings-products', filter],
    queryFn: getSavingsProducts,
  });

  const filteredProducts = useMemo(() => {
    if (!query.data) {
      return [];
    }
    if (!filter) {
      return query.data;
    }
    return filterSavingsProducts(query.data, filter);
  }, [filter, query.data]);

  return {
    ...query,
    data: filteredProducts,
  };
}
