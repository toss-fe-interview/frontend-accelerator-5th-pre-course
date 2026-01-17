import { useCallback, useState } from 'react';

import { SavingsProduct } from 'entities/savings/model/types';

export const useProductSelection = (products: SavingsProduct[]) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const selectedProduct = products.find(product => product.id === selectedProductId);

  const handleSelectProduct = useCallback((product: SavingsProduct | null) => {
    setSelectedProductId(product?.id ?? null);
  }, []);

  return {
    selectedProduct,
    handleSelectProduct,
    selectedProductId,
  };
};
