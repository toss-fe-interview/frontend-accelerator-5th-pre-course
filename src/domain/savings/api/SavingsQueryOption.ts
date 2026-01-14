import { queryOptions } from '@tanstack/react-query';
import SavingsApi from 'domain/savings/api/SavingsApi';

export const SavingsQueryOption = {
  getSavings: queryOptions({
    queryKey: ['savings'],
    queryFn: SavingsApi.getSavings,
  }),
};
