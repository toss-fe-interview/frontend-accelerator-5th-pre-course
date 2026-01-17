import React from 'react';
import { ProductItem } from 'types/products';

interface ProductListProps {
  items: ProductItem[];
  renderItem: (product: ProductItem) => JSX.Element;
}

export default function ProductList({ items, renderItem }: ProductListProps) {
  return (
    <>
      {items.map(item => (
        <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
      ))}
    </>
  );
}
