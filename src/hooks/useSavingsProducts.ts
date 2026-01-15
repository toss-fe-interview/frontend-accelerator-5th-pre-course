import { useQuery } from '@tanstack/react-query';
import { getSavingsProducts } from 'api/savings';

export function useSavingProducts() {
  return useQuery({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });
}
