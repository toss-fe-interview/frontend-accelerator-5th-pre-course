import { useSuspenseQuery } from '@tanstack/react-query';

import type { SavingsProduct, SavingsProductsFilterParams } from '@savings/apis/type';
import { savingsQueryOptions } from './options';

type UseSavingsProductsProps = {
  filterParams?: SavingsProductsFilterParams;
};

const useSavingsProducts = ({ filterParams }: UseSavingsProductsProps) => {
  const { data: savingsProducts } = useSuspenseQuery({
    ...savingsQueryOptions.products(filterParams),
  });

  const { monthlySaving, savingPeriod } = filterParams ?? {};

  const filteredProduct = savingsProducts.filter((savingsProduct: SavingsProduct) => {
    const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;
    // 1. 월 납입액 조건
    const monthlyMatchs = !monthlySaving || (monthlySaving >= minMonthlyAmount && monthlySaving <= maxMonthlyAmount);

    // 2. 저축 기간 조건
    const termMathcs = !savingPeriod || availableTerms === savingPeriod;

    return monthlyMatchs && termMathcs;
  });

  return {
    data: filteredProduct,
  };
};

export default useSavingsProducts;
