import { SavingsProduct } from 'shared/api/type';

export const getFilterSavingProducts = (
  products: SavingsProduct[],
  conditions: {
    monthlyDeposit: number;
    savingPeriod: number;
  }
) => {
  const moreThanMinMonthly = (product: SavingsProduct) => product.minMonthlyAmount <= conditions.monthlyDeposit;
  const lessThanMaxMonthly = (product: SavingsProduct) => product.maxMonthlyAmount >= conditions.monthlyDeposit;
  const sameAvailableTerms = (product: SavingsProduct) => product.availableTerms === conditions.savingPeriod;

  const filteredSavingProducts = products.filter(
    product => moreThanMinMonthly(product) && lessThanMaxMonthly(product) && sameAvailableTerms(product)
  );

  return filteredSavingProducts;
};

export const getRecommendSavingProducts = (products: SavingsProduct[], limit = 2) =>
  products
    .slice()
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, limit);

export const toNumeric = (value: string) => Number(value.replace(/,/g, ''));
