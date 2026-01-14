import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSavingsProducts } from 'features/savings/apis/savingsProducts';
import { queryKeys } from 'features/savings/constants/queryKeys';

export function useSuspenseSavingsProducts() {
  return useSuspenseQuery({
    queryKey: queryKeys.savingsProducts,
    queryFn: fetchSavingsProducts,
  });
}
