import { ReactNode } from 'react';

import { SavingsProduct } from 'types/SavingsProduct.type';

interface RecommendedProductSectionProps {
  candidateProducts: SavingsProduct[];
  emptyFallback: ReactNode;
  children: (recommendedItems: SavingsProduct[]) => ReactNode;
}

export function RecommendedProductSection({
  candidateProducts,
  emptyFallback,
  children,
}: RecommendedProductSectionProps) {
  const recommendedItems = [...candidateProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const isEmpty = recommendedItems.length === 0;

  if (isEmpty) {
    return <>{emptyFallback}</>;
  }

  return <>{children(recommendedItems)}</>;
}
