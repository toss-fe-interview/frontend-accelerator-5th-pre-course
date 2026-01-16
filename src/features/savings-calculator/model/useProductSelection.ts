import { useState } from 'react';

import { SavingsProduct } from 'entities/savings/model/types';

export function useProductSelection(products: SavingsProduct[]) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const selectedProduct = products.find(product => product.id === selectedProductId);

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
  };

  return {
    selectedProduct,
    handleSelectProduct,
    selectedProductId,
  };
}
