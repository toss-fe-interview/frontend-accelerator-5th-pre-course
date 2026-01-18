import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { filterByMonthlyAmount, filterByTerm } from 'utils/filterSavingsProduct';
import { savingsProductQueryOptions } from '../queries/savingsProductsQueryOptions';

export const GetRecommendedProducts = ({ children }: { children: (products: SavingProduct[]) => React.ReactNode }) => {
  const { data: savingProducts } = useSuspenseQuery(savingsProductQueryOptions());
  const { monthlyAmount, term } = useWatch();

  const sortDescendingByAnnualRate = (a: SavingProduct, b: SavingProduct) => b.annualRate - a.annualRate;

  const recommendedProducts = savingProducts
    .filter(product => filterByTerm(product, term))
    .filter(product => filterByMonthlyAmount(product, monthlyAmount))
    .sort(sortDescendingByAnnualRate)
    .slice(0, 2);

  return children(recommendedProducts);
};
