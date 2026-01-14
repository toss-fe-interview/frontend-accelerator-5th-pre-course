import { useMemo } from 'react';
import { SavingsProduct } from '../schemas/savingsProduct';

export default function useFilteredSavingsProducts(
  savingsProducts: SavingsProduct[],
  monthlyPaymentAmount: number,
  savingsPeriod: number
) {
  return useMemo(
    () =>
      savingsProducts.filter(product => {
        const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = product;

        return (
          minMonthlyAmount < monthlyPaymentAmount &&
          monthlyPaymentAmount < maxMonthlyAmount &&
          savingsPeriod === availableTerms
        );
      }),
    [savingsProducts, monthlyPaymentAmount, savingsPeriod]
  );
}
