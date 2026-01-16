import { ReactNode } from 'react';

import { SavingsProduct } from 'entities/savings/model/types';

import {
  calculateDifferenceAmount,
  calculateFinalAmount,
  calculateRecommendedMonthlyAmount,
} from 'features/savings-calculator/lib/calculationUtil';

interface CalculationResult {
  finalAmount: number;
  differenceAmount: number;
  recommendedMonthlyAmount: number;
}

interface CalculationResultSectionProps {
  product: SavingsProduct | null;
  targetAmount: number;
  monthlyAmount: number;
  term: number;
  emptyFallback: ReactNode;
  children: (result: CalculationResult) => ReactNode;
}

export function CalculationResultSection({
  product,
  targetAmount,
  monthlyAmount,
  term,
  emptyFallback,
  children,
}: CalculationResultSectionProps) {
  if (product === null) {
    return <>{emptyFallback}</>;
  }

  const { annualRate } = product;

  const finalAmount = calculateFinalAmount({
    monthlyAmount,
    term,
    annualRate,
  });
  const differenceAmount = calculateDifferenceAmount({ targetAmount, finalAmount });
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount({
    targetAmount,
    term,
    annualRate,
  });

  return <>{children({ finalAmount, differenceAmount, recommendedMonthlyAmount })}</>;
}
