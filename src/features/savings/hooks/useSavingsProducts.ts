import { useQuery } from '@tanstack/react-query';
import { savingsProductQuery } from '../apis/queries';

export const useSavingsProducts = (monthlyPayment: string) => {
  const { data: savingsProducts } = useQuery(savingsProductQuery.listQuery());

  const filteredSavingsProducts = savingsProducts?.filter(product => {
    const monthly = parseInt(monthlyPayment) || 0;

    if (monthly === 0) {
      return true;
    }

    return monthly >= product.minMonthlyAmount && monthly <= product.maxMonthlyAmount;
  });

  const baseProducts = filteredSavingsProducts?.length ? filteredSavingsProducts : savingsProducts;
  const recommendedProducts = [...(baseProducts ?? [])].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return {
    filteredSavingsProducts,
    recommendedProducts,
    savingsProducts,
  };
};
