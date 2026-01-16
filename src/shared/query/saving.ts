import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import SavingsApi from 'shared/api/savings';
import { SavingsProductType } from 'shared/types/api/savings';

const SavingsQuery = {
  getSavingsProducts: (options?: Omit<UseQueryOptions<SavingsProductType[]>, 'queryKey' | 'queryFn'>) =>
    queryOptions({
      queryKey: ['savings-products'],
      queryFn: () => SavingsApi.getSavingsProducts(),
      ...options,
    }),
};

export default SavingsQuery;
