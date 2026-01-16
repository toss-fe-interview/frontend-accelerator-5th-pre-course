import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingsProduct } from 'api/savings-products';
import { savingsProductsQueryOptions } from 'queries/savings-products';
import React, { useMemo } from 'react';
import { filterSavingsProducts } from 'utils/savings-filter';

interface GetProductRecommendationProps {
  term: number;
  monthlyAmount?: number;

  children: (savingsProducts: SavingsProduct[]) => React.ReactNode;
}

const GetProductRecommendation = ({ children, term, monthlyAmount }: GetProductRecommendationProps) => {
  const { data: savingsProducts } = useSuspenseQuery<SavingsProduct[]>(savingsProductsQueryOptions());

  const filteredSavingsProducts = useMemo(() => {
    return filterSavingsProducts(savingsProducts, term, monthlyAmount);
  }, [savingsProducts, term, monthlyAmount]);

  const recommendedSavingsProducts = filteredSavingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return children(recommendedSavingsProducts);
};

export default GetProductRecommendation;
