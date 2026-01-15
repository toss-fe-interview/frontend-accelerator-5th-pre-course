import { useSuspenseQuery } from '@tanstack/react-query';
import { getSavingsProducts, SavingsProduct } from 'api';
import { FilterFn, OrderByFn } from 'components/ProductList';

type ProductFilterOptions = {
  filters?: FilterFn[];
  sortBy?: OrderByFn;
  limit?: number;
};

export function useSavingsProductsQuery({ filters, sortBy, limit }: ProductFilterOptions) {
  return useSuspenseQuery({
    queryKey: ['savingsProducts'],
    queryFn: () => getSavingsProducts(),
    select: (data: SavingsProduct[]) => {
      let result = data;

      if (filters) {
        result = result.filter(product => filters.every(filter => filter(product)));
      }

      if (sortBy) {
        result = result.sort(sortBy);
      }

      if (limit) {
        result = result.slice(0, limit);
      }

      return result;
    },
  });
}
