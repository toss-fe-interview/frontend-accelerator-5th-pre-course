import { Assets } from 'tosslib';
import type { SavingsProduct } from '../api/api';
import ProductItem from './ProductItem';

export default function ProductList({
  products,
  selectedProductId,
  onProductSelect,
}: {
  products?: SavingsProduct[];
  selectedProductId?: string;
  onProductSelect: (id: string) => void;
}) {
  return (
    <div>
      {products?.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onProductSelect={() => onProductSelect(product.id)}
        />
      ))}
    </div>
  );
}
