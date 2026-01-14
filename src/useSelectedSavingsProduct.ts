import { useState } from 'react';
import { SavingsProduct } from 'types';

export default function useSelectedSavingsProduct() {
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const handleSelectSavingsProduct = (savingsProduct: SavingsProduct) => {
    setSelectedSavingsProduct(savingsProduct);
  };

  return {
    selectedSavingsProduct,
    handleSelectSavingsProduct,
  };
}
