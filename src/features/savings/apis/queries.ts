import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from './apis';

export const savingsProductQuery = {
  all: 'savings-product',
  listQuery: () =>
    queryOptions({
      queryKey: [savingsProductQuery.all, 'list'],
      queryFn: getSavingsProducts,
    }),
};
