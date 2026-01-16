import { queryOptions } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingsProduct } from 'types/savings';

export const savingsProductApis = {
  getSavingsProducts: async () => await http.get<SavingsProduct[]>('/api/savings-products'),
};

export const getSavingsProductsQueryOptions = () =>
  queryOptions({
    queryKey: ['savingsProductsList'],
    queryFn: savingsProductApis.getSavingsProducts,
  });
