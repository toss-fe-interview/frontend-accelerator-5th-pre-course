import { SavingsProduct } from 'features/savings/types/savingsProduct';

type SavingsFilterOptions = {
  monthlyPaymentAmount: number;
  savingsPeriod: number;
};

export function filterSavings(products: SavingsProduct[], options: SavingsFilterOptions) {
  const { monthlyPaymentAmount, savingsPeriod } = options;

  return products.filter(product => {
    const isMonthlyAmountValid =
      product.minMonthlyAmount <= monthlyPaymentAmount && monthlyPaymentAmount <= product.maxMonthlyAmount;

    const isPeriodValid = product.availableTerms === savingsPeriod;

    return isMonthlyAmountValid && isPeriodValid;
  });
}

export const recommendSavings = (savingsProducts: SavingsProduct[], limit: number) => {
  return savingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, limit);
};
