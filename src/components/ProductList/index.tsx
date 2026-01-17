import { SuspenseQuery } from '@suspensive/react-query';
import { queryOptions } from '@tanstack/react-query';
import type { SavingsProduct } from 'domains/Savings/types';
import type React from 'react';
import { http } from 'tosslib';

export const savingsProductsQueryOptions = queryOptions({
  queryKey: ['savings', 'products'],
  queryFn: async (): Promise<SavingsProduct[]> => {
    return await http.get<SavingsProduct[]>('/api/savings-products');
  },
});

interface ProductListProps<T> {
  select: (products: SavingsProduct[]) => T[];
  renderProps: (item: T) => React.ReactNode;
}

export function ProductList<T>({ select, renderProps }: ProductListProps<T>) {
  return (
    <SuspenseQuery {...savingsProductsQueryOptions} select={select}>
      {({ data }) => <>{data.map(renderProps)}</>}
    </SuspenseQuery>
  );
}
