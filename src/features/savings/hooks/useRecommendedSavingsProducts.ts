import { useMemo } from 'react';
import { SavingsProduct } from '../schemas/savingsProduct';

export default function useRecommendedSavingsProducts(savingsProducts: SavingsProduct[], limit: number = 2) {
  return useMemo(() => savingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, limit), [savingsProducts]);
}
