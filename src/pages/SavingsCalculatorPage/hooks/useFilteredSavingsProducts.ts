import { useMemo } from 'react';
import { SavingsProduct, SavingsInput } from '../types/types';

export function useFilteredSavingsProducts(savingsProducts: SavingsProduct[], savingsInput: SavingsInput) {
  const filteredSavingsProducts = useMemo(() => {
    if (savingsProducts.length === 0) {
      return [];
    }

    const monthlyAmountNumber = Number(savingsInput.monthlyAmount);
    const hasMonthlyAmount = savingsInput.monthlyAmount !== '' && !isNaN(monthlyAmountNumber);

    if (!hasMonthlyAmount) {
      return savingsProducts;
    }

    const filteredProducts = savingsProducts.filter(product => {
      const isMonthlyAmountValid =
        monthlyAmountNumber >= product.minMonthlyAmount && monthlyAmountNumber <= product.maxMonthlyAmount;
      const isTermMatched = product.availableTerms === savingsInput.savingsTerm;
      return isMonthlyAmountValid && isTermMatched;
    });

    return filteredProducts;
  }, [savingsProducts, savingsInput.monthlyAmount, savingsInput.savingsTerm]);

  return filteredSavingsProducts;
}
