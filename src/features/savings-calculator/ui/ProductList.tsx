import React from 'react';
import type { SavingsProduct } from 'features/savings-calculator';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSavingsProductsQueryOptions } from '../api';

export function ProductList({
  select,
  renderItem,
}: {
  select?: (products: SavingsProduct[]) => SavingsProduct[];
  renderItem: (product: SavingsProduct) => React.ReactNode;
}) {
  const { data: result } = useSuspenseQuery({...getSavingsProductsQueryOptions(), select});

  return result.map(product => <React.Fragment key={product.id}>{renderItem(product)}</React.Fragment>);
}
