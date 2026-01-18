import { queryOptions } from '@tanstack/react-query';
import { fetchSavingsProducts } from 'features/savings/apis/savingsProducts';
import { queryKeys } from 'features/savings/constants/queryKeys';

export const savingsProductsQueryOptions = queryOptions({
  queryKey: queryKeys.savingsProducts,
  queryFn: fetchSavingsProducts,
});
