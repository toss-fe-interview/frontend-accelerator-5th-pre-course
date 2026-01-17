import { SuspenseQuery } from '@suspensive/react-query';
import { queryOptions } from '@tanstack/react-query';
import type { SavingsProduct } from 'domains/Savings/types';
import type React from 'react';
import { colors, http, ListRow } from 'tosslib';

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

interface ProductItemProps {
  product: SavingsProduct;
}

function ProductItem({ product }: ProductItemProps) {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={product.name}
      topProps={{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.grey900,
      }}
      middle={`연 이자율: ${product.annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${product.availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}

ProductList.Item = ProductItem;
