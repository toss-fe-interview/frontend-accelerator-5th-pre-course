import { SavingsProduct } from 'features/savings/types/savingsProduct';

export const isSavingsProductMatched = (
  savingsProduct: SavingsProduct,
  monthlyPaymentAmount: number,
  savingsPeriod: number
) => {
  const isMonthlyAmountMatched =
    savingsProduct.minMonthlyAmount <= monthlyPaymentAmount && monthlyPaymentAmount <= savingsProduct.maxMonthlyAmount;

  const isPeriodValidMatched = savingsProduct.availableTerms === savingsPeriod;

  return isMonthlyAmountMatched && isPeriodValidMatched;
};

export const recommendSavings = (savingsProducts: SavingsProduct[], limit: number) => {
  return savingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, limit);
};
