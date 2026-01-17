import { queryOptions } from '@tanstack/react-query';
import { savingsApis } from '@savings/apis';
import type { SavingsProductsFilterParams } from '@savings/apis/type';

const keys = {
  all: ['savings'] as const,
  products: (filterParams?: SavingsProductsFilterParams) => [...keys.all, 'products', filterParams] as const,
};

export const savingsQueryOptions = {
  products: (filterParams?: SavingsProductsFilterParams) =>
    queryOptions({
      queryKey: keys.products(filterParams),
      queryFn: () => savingsApis.getSavingsProducts(),
    }),
};
