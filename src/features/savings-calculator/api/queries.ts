import { queryOptions } from '@tanstack/react-query';
import { fetchSavingsProducts } from './api';

export const savingsProductsQueries = {
  all: () => ['savings-products'] as const,
  list: () => [...savingsProductsQueries.all(), 'list'] as const,

  listQuery: () =>
    queryOptions({
      queryKey: savingsProductsQueries.list(),
      queryFn: fetchSavingsProducts,
    }),
};
