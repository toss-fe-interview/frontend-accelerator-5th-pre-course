import { SavingsProduct } from '../api';
import { CalculInputs } from '../components/SavingCalculatorInput';
import { CalculationResult } from '../components/SavingResult';

export function formatToKRW(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function calculateExpectedProfit(monthlyAmount: number, term: number, annualRate: number): number {
  return monthlyAmount * term * (1 + annualRate * 0.5);
}

function calculateDifferenceFromTarget(targetAmount: number, expectedProfit: number): number {
  return targetAmount - expectedProfit;
}

function calculateRecommendedMonthlyAmount(targetAmount: number, term: number, annualRate: number): number {
  if (term === 0) {
    return 0;
  }
  const factor = term * (1 + annualRate * 0.5);
  const recommendedAmount = targetAmount / factor;
  return Math.round(recommendedAmount / 1000) * 1000;
}

export function calculateSavingResult(
  selectedProduct: SavingsProduct | null,
  calculInputs: CalculInputs
): CalculationResult | null {
  if (!selectedProduct) {
    return null;
  }

  const expectedProfit = calculateExpectedProfit(
    calculInputs.monthlyAmount,
    calculInputs.term,
    selectedProduct.annualRate
  );
  const difference = calculateDifferenceFromTarget(calculInputs.targetAmount, expectedProfit);
  const recommendedMonthly = calculateRecommendedMonthlyAmount(
    calculInputs.targetAmount,
    calculInputs.term,
    selectedProduct.annualRate
  );

  return {
    expectedProfit,
    difference,
    recommendedMonthly,
  };
}
