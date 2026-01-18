import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from './api';

export const savingsProductsQueryOptions = queryOptions({
  queryKey: ['savings-products'],
  queryFn: getSavingsProducts,
});
