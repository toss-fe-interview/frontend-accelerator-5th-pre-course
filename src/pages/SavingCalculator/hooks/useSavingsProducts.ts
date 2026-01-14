import { useMemo } from 'react';
import { useGetSavingsProducts } from '../api';
import { CalculInputs } from '../components/SavingCalculatorInput';

export function useSavingsProducts(inputs: CalculInputs) {
  const { data: savingsProducts } = useGetSavingsProducts();

  const filteredProducts = useMemo(() => {
    // 입력값이 설정되지 않은 경우 전체 상품 표시
    if (inputs.monthlyAmount === 0 && inputs.term === 0) {
      return savingsProducts;
    }

    return savingsProducts.filter(product => {
      const monthlyAmountMatch =
        inputs.monthlyAmount === 0 ||
        (inputs.monthlyAmount > product.minMonthlyAmount && inputs.monthlyAmount < product.maxMonthlyAmount);

      const termMatch = inputs.term === 0 || product.availableTerms === inputs.term;

      return monthlyAmountMatch && termMatch;
    });
  }, [inputs, savingsProducts]);

  const recommendedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [filteredProducts]);

  return { savingsProducts, filteredProducts, recommendedProducts };
}
