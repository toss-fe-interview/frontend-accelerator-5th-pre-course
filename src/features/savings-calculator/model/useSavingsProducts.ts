import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSavingsProducts } from '../api';

interface UseSavingsProductsParams {
  monthlyAmount: number;
  availableTerms: number;
}

export function useSavingsProducts({ monthlyAmount, availableTerms }: UseSavingsProductsParams) {
  const { data } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: fetchSavingsProducts,
  });

  const filteredProducts = data.filter(
    product =>
      product.minMonthlyAmount <= monthlyAmount &&
      product.maxMonthlyAmount >= monthlyAmount &&
      product.availableTerms <= availableTerms
  );

  return { products: filteredProducts };
}
