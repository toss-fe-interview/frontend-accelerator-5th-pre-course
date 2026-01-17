import React from 'react';
import type { SavingsProduct } from 'features/savings-calculator/api/savings';
import { useSavingsProducts } from 'features/savings-calculator/model/useSavingsProducts';

export function ProductList({
  select = products => products,
  renderItem,
}: {
  select?: (products: SavingsProduct[]) => SavingsProduct[];
  renderItem: (product: SavingsProduct) => React.ReactNode;
}) {
  const { products } = useSavingsProducts();
  const result = select(products);

  return result.map(product => <React.Fragment key={product.id}>{renderItem(product)}</React.Fragment>);
}
