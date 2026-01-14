import { SavingsProduct } from "components/Savings";

interface FilterCriteria {
  monthlyDeposit: number;
  period: number;
}

export function filterSavingsProducts(
  products: SavingsProduct[],
  criteria: FilterCriteria
): SavingsProduct[] {
  const { monthlyDeposit, period } = criteria;

  return products.filter((product) => {
    const isValidAmount =
      monthlyDeposit > product.minMonthlyAmount &&
      monthlyDeposit < product.maxMonthlyAmount;

    const isValidPeriod = product.availableTerms === period;

    return isValidAmount && isValidPeriod;
  });
}
