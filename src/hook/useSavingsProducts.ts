import { useQuery } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingsProduct, SavingsProductsSchema } from 'types/savingsProducts';

export const getSavingsProducts = async (): Promise<SavingsProduct[]> => {
  const response = await http.get('/api/savings-products');
  return SavingsProductsSchema.parse(response);
};

export const useSavingsProducts = () => {
  return useQuery({
    queryKey: ['savingsProducts'],
    queryFn: getSavingsProducts,
  });
};
