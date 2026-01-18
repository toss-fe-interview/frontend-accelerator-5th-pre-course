import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { filterByMonthlyAmount, filterByTerm } from 'utils/filterSavingsProduct';
import { savingsProductQueryOptions } from '../queries/savingsProductsQueryOptions';

export const GetFilteredProducts = ({ children }: { children: (products: SavingProduct[]) => React.ReactNode }) => {
  const { data: savingProducts } = useSuspenseQuery(savingsProductQueryOptions());
  const { monthlyAmount, term } = useWatch();

  const filteredProducts = savingProducts
    .filter(product => filterByTerm(product, term))
    .filter(product => filterByMonthlyAmount(product, monthlyAmount));

  return children(filteredProducts);
};
