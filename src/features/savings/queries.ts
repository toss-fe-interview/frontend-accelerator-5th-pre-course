import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts } from './api';

export const savingsKeys = {
  all: ['savings'] as const,
};

export const savingsQueries = {
  list: () =>
    queryOptions({
      queryKey: savingsKeys.all,
      queryFn: getSavingsProducts,
    }),
};
