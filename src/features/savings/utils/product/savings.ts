import { SavingsProduct } from 'features/savings/schemas/savingsProduct';

export const filterSavings = (
  savingsProducts: SavingsProduct[],
  monthlyPaymentAmount: number,
  savingsPeriod: number
) => {
  return savingsProducts.filter(product => {
    const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = product;

    return (
      minMonthlyAmount < monthlyPaymentAmount &&
      monthlyPaymentAmount < maxMonthlyAmount &&
      savingsPeriod === availableTerms
    );
  });
};

export const recommendSavings = (savingsProducts: SavingsProduct[], limit: number) => {
  return savingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, limit);
};
