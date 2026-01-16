import { queryOptions } from '@tanstack/react-query';
import { getSavingsProducts, SavingsProduct } from 'api/savings-products';

export const savingsProductsQueryOptions = () => {
  return queryOptions<SavingsProduct[], Error>({
    queryKey: ['savings-products'],
    queryFn: () => getSavingsProducts(),
  });
};
