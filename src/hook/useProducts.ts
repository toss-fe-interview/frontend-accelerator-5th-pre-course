import { useQuery } from '@tanstack/react-query';
import { getSavingsProducts, SavingsProduct } from 'api/product';
import { useMemo } from 'react';

const filterSavingsProducts = ({
  savingsProducts,
  monthlyPayment,
  savingPeriod,
}: {
  savingsProducts: SavingsProduct[];
  monthlyPayment: number;
  savingPeriod: number;
}) => {
  return savingsProducts?.filter(
    product =>
      product.minMonthlyAmount < monthlyPayment &&
      product.maxMonthlyAmount > monthlyPayment &&
      product.availableTerms === savingPeriod
  );
};

export const useProducts = ({ monthlyPayment, savingPeriod }: { monthlyPayment: number; savingPeriod: number }) => {
  const { data: savingsProducts } = useQuery({
    queryKey: ['savingsProducts'],
    queryFn: getSavingsProducts,
  });

  const filteredProducts = useMemo(() => {
    return filterSavingsProducts({
      savingsProducts: savingsProducts ?? [],
      monthlyPayment,
      savingPeriod,
    });
  }, [savingsProducts, monthlyPayment, savingPeriod]);

  return {
    products: filteredProducts,
  };
};
