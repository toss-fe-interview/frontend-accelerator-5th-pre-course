import { SavingsProduct } from 'features/savings/types/savingsProduct';

export const isSavingsProductMatched = (
  savingsProduct: SavingsProduct,
  monthlyPaymentAmount: number,
  savingsPeriod: number
) => {
  const isMonthlyAmountValid =
    savingsProduct.minMonthlyAmount <= monthlyPaymentAmount && monthlyPaymentAmount <= savingsProduct.maxMonthlyAmount;

  const isPeriodValid = savingsProduct.availableTerms === savingsPeriod;

  return isMonthlyAmountValid && isPeriodValid;
};

export const recommendSavings = (savingsProducts: SavingsProduct[], limit: number) => {
  return savingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, limit);
};
