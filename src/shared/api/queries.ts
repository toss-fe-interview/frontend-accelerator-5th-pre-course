import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from './fetcher';

export const queries = {
  savingsProducts: () =>
    queryOptions({
      queryKey: ['savingsProducts'],
      queryFn: () => getSavingsProducts(),
    }),
};
