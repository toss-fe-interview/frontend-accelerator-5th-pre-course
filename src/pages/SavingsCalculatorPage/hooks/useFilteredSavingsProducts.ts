import { useEffect, useState } from 'react';
import { SavingsProduct, SavingsInput } from '../types/types';

export function useFilteredSavingsProducts(savingsProducts: SavingsProduct[], savingsInput: SavingsInput) {
  const [filteredSavingsProducts, setFilteredSavingsProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    if (savingsProducts.length === 0) {
      return;
    }

    const monthlyAmountNumber = Number(savingsInput.monthlyAmount);
    const hasMonthlyAmount = savingsInput.monthlyAmount !== '' && !isNaN(monthlyAmountNumber);

    if (!hasMonthlyAmount) {
      setFilteredSavingsProducts(savingsProducts);
      return;
    }

    const filteredProducts = savingsProducts.filter(product => {
      const isMonthlyAmountValid =
        monthlyAmountNumber >= product.minMonthlyAmount && monthlyAmountNumber <= product.maxMonthlyAmount;
      const isTermMatched = product.availableTerms === savingsInput.savingsTerm;
      return isMonthlyAmountValid && isTermMatched;
    });

    setFilteredSavingsProducts(filteredProducts);
  }, [savingsProducts, savingsInput]);

  return filteredSavingsProducts;
}
