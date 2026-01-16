import { queryOptions } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingsProduct } from 'type';

export const getSavingsProducts = () => http.get<SavingsProduct[]>('/api/savings-products');

export const savingsProductsQuery = () =>
  queryOptions({
    queryKey: ['savingsProducts'],
    queryFn: () => getSavingsProducts(),
  });
