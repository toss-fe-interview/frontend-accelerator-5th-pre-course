import { useQuery } from '@tanstack/react-query';
import { savingsProductQuery } from '../apis/queries';

export const useSavingsProducts = (monthlyPayment: number) => {
  const { data: savingsProducts } = useQuery(savingsProductQuery.listQuery());

  const filteredSavingsProducts = savingsProducts?.filter(product => {
    if (monthlyPayment === 0) {
      return true;
    }

    return monthlyPayment >= product.minMonthlyAmount && monthlyPayment <= product.maxMonthlyAmount;
  });

  const baseProducts = filteredSavingsProducts?.length ? filteredSavingsProducts : savingsProducts;
  const recommendedProducts = [...(baseProducts ?? [])].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return {
    filteredSavingsProducts,
    recommendedProducts,
    savingsProducts,
  };
};
