import { SavingsProductItem } from './../../../services/savings/index';
import { UseQueryOptions } from './../../../../node_modules/@tanstack/react-query/src/types';
import { useQuery } from '@tanstack/react-query';
import { getSavingsProduct } from 'services/savings';

export const SAVINGS_QUERY_KEYS = {
  list: ['savingsProducts', 'list'],
};

export const useSavingsProducts = (opts: Partial<UseQueryOptions<SavingsProductItem[], Error>> = {}) => {
  return useQuery({ queryKey: [...SAVINGS_QUERY_KEYS.list], queryFn: getSavingsProduct, ...opts });
};
