import { useEffect, useState } from 'react';
import { SavingsProduct, SavingsInput } from '../types/types';

const RECOMMENDED_PRODUCTS_COUNT = 2;

export function useRecommendedProducts(filteredSavingsProducts: SavingsProduct[], savingsInput: SavingsInput) {
  const [recommendedProducts, setRecommendedProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const hasTargetAmount = savingsInput.targetAmount !== '' && savingsInput.targetAmount.trim() !== '';
    const hasMonthlyAmount = savingsInput.monthlyAmount !== '' && savingsInput.monthlyAmount.trim() !== '';

    if (hasTargetAmount && hasMonthlyAmount && filteredSavingsProducts.length > 0) {
      // 연 이자율이 높은 순으로 정렬하고 상위 2개 선택
      const sortedByRate = [...filteredSavingsProducts].sort((a, b) => b.annualRate - a.annualRate);
      const topProducts = sortedByRate.slice(0, RECOMMENDED_PRODUCTS_COUNT);
      setRecommendedProducts(topProducts);
    } else {
      setRecommendedProducts([]);
    }
  }, [filteredSavingsProducts, savingsInput]);

  return recommendedProducts;
}
