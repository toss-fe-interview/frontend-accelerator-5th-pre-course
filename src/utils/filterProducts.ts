import { SavingsProduct } from 'hooks/useSavingsProducts';

interface FilterOptions {
  checkMonthlyAmount?: boolean;
  checkSavingPeriod?: boolean;
}

const filterProducts = (
  products: SavingsProduct[] | undefined,
  monthlyAmount: number,
  savingPeriod: number,
  options: FilterOptions = {}
) => {
  const { checkMonthlyAmount = true, checkSavingPeriod = true } = options;

  const shouldSkipAmountCheck = !checkMonthlyAmount || monthlyAmount === 0;
  const shouldSkipPeriodCheck = !checkSavingPeriod;

  return products?.filter(item => {
    const isAmountValid =
      shouldSkipAmountCheck || (monthlyAmount >= item.minMonthlyAmount && monthlyAmount <= item.maxMonthlyAmount);

    const isTermValid = shouldSkipPeriodCheck || item.availableTerms === savingPeriod;

    return isAmountValid && isTermValid;
  });
};

export default filterProducts;
