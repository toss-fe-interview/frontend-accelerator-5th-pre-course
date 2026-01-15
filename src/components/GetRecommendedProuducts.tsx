import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { filterSavingsProduct } from 'utils/filterSavingsProduct';
import { savingsProductQueryOptions } from '../queries/savingsProductsQueryOptions';

export const GetRecommendedProducts = ({ children }: { children: (products: SavingProduct[]) => React.ReactNode }) => {
  const { data: savingProducts } = useSuspenseQuery(savingsProductQueryOptions());
  const { monthlyAmount, term } = useWatch();

  const recommendedProducts = savingProducts
    .filter(product => filterSavingsProduct(product, term, monthlyAmount))
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return children(recommendedProducts);
};
