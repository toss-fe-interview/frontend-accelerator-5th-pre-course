import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { filterSavingsProduct } from 'utils/filterSavingsProduct';
import { savingsProductQueryOptions } from '../queries/savingsProductsQueryOptions';

export const GetFilteredProducts = ({ children }: { children: (products: SavingProduct[]) => React.ReactNode }) => {
  const { data: savingProducts } = useSuspenseQuery(savingsProductQueryOptions());
  const { monthlyAmount, term } = useWatch();

  const filteredProducts = savingProducts.filter(product => filterSavingsProduct(product, term, monthlyAmount));

  return children(filteredProducts);
};
