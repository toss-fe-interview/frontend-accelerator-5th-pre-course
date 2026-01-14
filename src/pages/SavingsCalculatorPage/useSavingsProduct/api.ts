import { useSuspenseQuery } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingsProduct } from './types';

export const useSavingsProductsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['savingsProducts'],
    queryFn: async () => {
      const response = await http.get<SavingsProduct[]>('/api/savings-products');
      return response;
    },
  });
};
