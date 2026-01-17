import { useQuery } from '@tanstack/react-query';
import { savingsProductsApi } from '../api/savingsProductsApi';

export function useSavingsProducts() {
  return useQuery({
    queryKey: ['savingsProducts'],
    queryFn: () => savingsProductsApi(),
  });
}
