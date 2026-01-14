import { useQuery } from '@tanstack/react-query';
import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from '../model';

export const getSavingsProducts = async () => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(`${error.message}`);
    }
  }
};

const useSavingsProductsQuery = () => {
  return useQuery({ queryKey: ['savingsProducts'], queryFn: getSavingsProducts });
};

export default useSavingsProductsQuery;
