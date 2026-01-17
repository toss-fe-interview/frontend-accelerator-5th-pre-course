import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from './apis';

export const savingsProductQuery = {
  all: ['savings-products'] as const,
  listQuery: () =>
    queryOptions({
      queryKey: [savingsProductQuery.all, 'list'] as const,
      queryFn: getSavingsProducts,
    }),
};
