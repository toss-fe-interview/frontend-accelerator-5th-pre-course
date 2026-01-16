import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingsProduct } from 'api/savings-products';
import { savingsProductsQueryOptions } from 'queries/savings-products';
import React, { useMemo } from 'react';
import { filterSavingsProducts } from 'utils/savings-filter';

interface GetSavingsProductListProps {
  term: number;
  monthlyAmount?: number;

  children: (savingsProducts: SavingsProduct[]) => React.ReactNode;
}

const GetSavingsProductList = ({ children, term, monthlyAmount }: GetSavingsProductListProps) => {
  const { data: savingsProducts } = useSuspenseQuery<SavingsProduct[]>(savingsProductsQueryOptions());

  const filteredSavingsProducts = useMemo(() => {
    return filterSavingsProducts(savingsProducts, term, monthlyAmount);
  }, [savingsProducts, term, monthlyAmount]);

  return children(filteredSavingsProducts);
};

export default GetSavingsProductList;
