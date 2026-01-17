import { ReactNode } from 'react';

import { SavingsProduct } from 'entities/savings/model/types';

import {
  calculateDifferenceAmount,
  calculateFinalAmount,
  calculateRecommendedMonthlyAmount,
} from 'features/savings-calculator/lib/calculationUtil';
import { isCalculationReady } from 'features/savings-calculator/lib/savingsConditionValidators';
import { SavingsCondition } from 'features/savings-calculator/model/types';

interface CalculationResult {
  finalAmount: number;
  differenceAmount: number;
  recommendedMonthlyAmount: number;
}

interface CalculationResultSectionProps {
  product: SavingsProduct | null;
  condition: SavingsCondition;
  emptyFallback: ReactNode;
  children: (result: CalculationResult) => ReactNode;
}

export function CalculationResultSection({
  product,
  condition,
  emptyFallback,
  children,
}: CalculationResultSectionProps) {
  if (product === null || !isCalculationReady(condition)) {
    return <>{emptyFallback}</>;
  }

  const { monthlyAmount, term, targetAmount } = condition;
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
