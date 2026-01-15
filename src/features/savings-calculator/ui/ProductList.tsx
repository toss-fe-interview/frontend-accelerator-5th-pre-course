import React from 'react';
import type { SavingsProduct } from 'features/savings-calculator/api/savings';
import { useSavingsProducts } from 'features/savings-calculator/model/useSavingsProducts';

export function ProductList({
  filterBy,
  sortBy,
  limit,
  renderItem,
}: {
  filterBy: (product: SavingsProduct) => boolean;
  sortBy?: (a: SavingsProduct, b: SavingsProduct) => number;
  limit?: number;
  renderItem: (product: SavingsProduct) => React.ReactNode;
}) {
  const { products } = useSavingsProducts();
  let result = products.filter(filterBy);
  if (sortBy) result = result.sort(sortBy);
  if (limit) result = result.slice(0, limit);

  return result.map(product => <React.Fragment key={product.id}>{renderItem(product)}</React.Fragment>);
}
