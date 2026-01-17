import { queryOptions } from '@tanstack/react-query';

import { getSavingsProducts } from 'entities/savings/api/SavingsProduct.api';

const queryKey = ['savings-products'];
export const savingsProductsQueryOptions = queryOptions({
  queryKey,
  queryFn: getSavingsProducts,
});
