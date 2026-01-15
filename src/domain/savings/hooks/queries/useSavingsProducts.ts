import { useFetch } from '@shared/hooks';
import { savingsApis } from '@savings/apis';
import { SavingsForm } from '@savings/hooks';
import type { SavingsProduct } from '@savings/apis/type';

export type SavingsProductsFilterParams = Pick<SavingsForm, 'monthlySaving' | 'savingPeriod'>;

type UseSavingsProductsProps = {
  filterParams?: SavingsProductsFilterParams;
};

const useSavingsProducts = ({ filterParams }: UseSavingsProductsProps) => {
  const { data: savingsProducts } = useFetch(savingsApis.getSavingsProducts);

  const { monthlySaving, savingPeriod } = filterParams ?? {};

  const filteredProduct = savingsProducts.filter((savingsProduct: SavingsProduct) => {
    const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;
    // 1. 월 납입액 조건
    const monthlyMatchs =
      !monthlySaving || (Number(monthlySaving) >= minMonthlyAmount && Number(monthlySaving) <= maxMonthlyAmount);

    // 2. 저축 기간 조건
    const termMathcs = !savingPeriod || availableTerms === savingPeriod;

    return monthlyMatchs && termMathcs;
  });

  return {
    data: filteredProduct,
  };
};

export default useSavingsProducts;
