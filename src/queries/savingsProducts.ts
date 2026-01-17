import { queryOptions } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingsProduct, SavingsProductsSchema } from 'types/savingsProducts';

const getSavingsProducts = async (): Promise<SavingsProduct[]> => {
  const response = await http.get('/api/savings-products');
  return SavingsProductsSchema.parse(response);
};

export const savingsProductsQueryOptions = () =>
  queryOptions({
    queryKey: ['savingsProducts'],
    queryFn: getSavingsProducts,
  });
