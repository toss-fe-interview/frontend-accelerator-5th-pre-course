import React from 'react';
import { ProductItem } from 'types/products';

interface ProductListProps {
  items: ProductItem[];
  renderComponent: (product: ProductItem) => JSX.Element;
}

export default function ProductList({ items, renderComponent }: ProductListProps) {
  return (
    <>
      {items.map(item => (
        <React.Fragment key={item.id}>{renderComponent(item)}</React.Fragment>
      ))}
    </>
  );
}
