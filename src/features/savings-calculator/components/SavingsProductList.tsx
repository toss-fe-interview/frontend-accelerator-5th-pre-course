import type { SavingsProduct } from 'shared/types';
import { SavingsProductListItem } from './SavingsProductListItem';

interface SavingsProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelectProduct: (productId: string) => void;
}

export function SavingsProductList({ products, selectedProductId, onSelectProduct }: SavingsProductListProps) {
  return (
    <>
      {products.map(product => (
        <SavingsProductListItem
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onSelect={() => onSelectProduct(product.id)}
        />
      ))}
    </>
  );
}
