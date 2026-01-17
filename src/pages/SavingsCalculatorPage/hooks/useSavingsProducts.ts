import { useQuery } from '@tanstack/react-query';
import { getSavingsProducts } from '../api/getSavingsProducts';

export function useSavingsProducts() {
  return useQuery({
    queryKey: ['savingsProducts'],
    queryFn: getSavingsProducts,
  });
}
