import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from './apis';

export const savingsProductQuery = {
  all: 'savings-product',
  listKey: () => [savingsProductQuery.all, 'list'],
  listQuery: () =>
    queryOptions({
      queryKey: savingsProductQuery.listKey(),
      queryFn: getSavingsProducts,
    }),
};
