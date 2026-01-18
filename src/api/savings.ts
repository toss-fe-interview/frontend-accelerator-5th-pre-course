import { http } from 'tosslib';
import { queryOptions } from '@tanstack/react-query';
import { SavingsProduct } from 'types/savings';

export const getSavingsProducts = async (): Promise<SavingsProduct[]> => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const savingsProductQueryOptions = () =>
  queryOptions({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });
