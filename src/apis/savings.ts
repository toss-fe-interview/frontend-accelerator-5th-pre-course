import { http } from 'tosslib';
import { SavingsProduct } from '../types/savings';
import { useQuery } from '@tanstack/react-query';

export const getSavingsProducts = async () => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
};

export const useSavingsProducts = () => {
  return useQuery({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });
};
