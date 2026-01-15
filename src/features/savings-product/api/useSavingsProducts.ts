import { useQuery } from '@tanstack/react-query';
import { getSavingsProducts } from 'entities/savings-product/api/savingsProductApi';

export function useSavingsProducts() {
  return useQuery({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });
}
