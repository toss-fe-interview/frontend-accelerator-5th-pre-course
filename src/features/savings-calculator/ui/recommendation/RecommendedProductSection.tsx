import { ReactNode } from 'react';

import { SavingsProduct } from 'entities/savings/model/types';
import { SavingsProductListSection } from 'entities/savings/ui/SavingsProductListSection';

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

  return (
    <SavingsProductListSection products={recommendedItems} emptyFallback={emptyFallback}>
      {children}
    </SavingsProductListSection>
  );
}
