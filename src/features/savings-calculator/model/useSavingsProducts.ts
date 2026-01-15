import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSavingsProducts } from '../api';

export function useSavingsProducts() {
  const { data } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: fetchSavingsProducts,
  });

  return { products: data };
}
