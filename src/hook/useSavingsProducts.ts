import { useQuery } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingsProduct, SavingsProductsSchema } from 'types/savingsProducts';

export const getSavingsProducts = async (): Promise<SavingsProduct[]> => {
  try {
    const response = await http.get('/api/savings-products');
    const data = SavingsProductsSchema.parse(response);
    return data;
  } catch (error) {
    console.error('Failed to fetch or validate savings products:', error);
    throw error;
  }
};

export const useSavingsProducts = () => {
  const query = useQuery({
    queryKey: ['savingsProducts'],
    queryFn: getSavingsProducts,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
