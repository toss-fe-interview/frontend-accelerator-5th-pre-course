import { useFormContext } from 'react-hook-form';
import { SavingsProduct } from './useSavingsProducts';

const useFilteredProducts = (products: SavingsProduct[] | undefined) => {
  const { watch } = useFormContext();

  const monthlyAmount = Number(watch('monthlyAmount')) || 0;
  const savingPeriod = Number(watch('savingPeriod')) || 0;

  const filteredProducts = products?.filter(item => {
    const isAmountValid =
      monthlyAmount === 0 || (monthlyAmount >= item.minMonthlyAmount && monthlyAmount <= item.maxMonthlyAmount);
    const isTermValid = item.availableTerms === savingPeriod;
    return isAmountValid && isTermValid;
  });

  return filteredProducts;
};

export default useFilteredProducts;
