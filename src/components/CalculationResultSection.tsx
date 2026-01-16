import { ReactNode } from 'react';

import { SavingsProduct } from 'types/SavingsProduct.type';
import {
  calculateDifferenceAmount,
  calculateFinalAmount,
  calculateRecommendedMonthlyAmount,
} from 'utils/calculationUtil';

interface CalculationResult {
  finalAmount: number;
  differenceAmount: number;
  recommendedMonthlyAmount: number;
}

interface CalculationResultSectionProps {
  product: SavingsProduct | null;
  investment: { monthlyAmount: number; term: number };
  goal: { targetAmount: number };
  emptyFallback: ReactNode;
  children: (result: CalculationResult) => ReactNode;
}

export function CalculationResultSection({
  product,
  investment,
  goal,
  emptyFallback,
  children,
}: CalculationResultSectionProps) {
  if (product === null) {
    return <>{emptyFallback}</>;
  }

  const { monthlyAmount, term } = investment;
  const { targetAmount } = goal;
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
