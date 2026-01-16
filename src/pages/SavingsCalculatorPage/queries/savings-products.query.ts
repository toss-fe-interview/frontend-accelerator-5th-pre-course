import { queryOptions } from '@tanstack/react-query';
import { fetchSavingsProducts } from '../remotes/savings-products';

export const savingsProductsKeys = {
  all: ['savings-products'] as const,
  lists: () => [...savingsProductsKeys.all, 'lists'] as const,
};

export const savingsProductsQuery = queryOptions({
  queryKey: savingsProductsKeys.lists(),
  queryFn: fetchSavingsProducts,
});
