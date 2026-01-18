import { SavingsProduct } from 'features/savings/types/savingsProduct';

export const isMatchedProduct = (product: SavingsProduct, monthlyPaymentAmount: number, savingsPeriod: number) => {
  const isMonthlyAmountValid =
    product.minMonthlyAmount <= monthlyPaymentAmount && monthlyPaymentAmount <= product.maxMonthlyAmount;

  const isPeriodValid = product.availableTerms === savingsPeriod;

  return isMonthlyAmountValid && isPeriodValid;
};

export const recommendSavings = (savingsProducts: SavingsProduct[], limit: number) => {
  return savingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, limit);
};
