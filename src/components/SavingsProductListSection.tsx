import { ReactNode } from 'react';

import { SavingsProduct } from 'types/SavingsProduct.type';

interface SavingsProductListSectionProps {
  products: SavingsProduct[];
  emptyFallback: ReactNode;
  children: (items: SavingsProduct[]) => ReactNode;
}

export function SavingsProductListSection({ products, emptyFallback, children }: SavingsProductListSectionProps) {
  const isEmpty = products.length === 0;

  if (isEmpty) {
    return <>{emptyFallback}</>;
  }

  return <>{children(products)}</>;
}
