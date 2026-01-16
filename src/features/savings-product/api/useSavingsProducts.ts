import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from 'entities/savings-product/api/savingsProductApi';

export const savingsProductsQueryOptions = () =>
  queryOptions({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });
