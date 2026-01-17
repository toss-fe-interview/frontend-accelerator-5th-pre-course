import { SavingsProduct } from '../api';
import { CalcSavingResult, CalculInputs } from '../SavingsCalculatorPage';

export function formatToKRW(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export function parseNumber(value: string): number {
  const cleanValue = value.replace(/,/g, '');
  return cleanValue === '' ? 0 : Number(cleanValue);
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
  calcInputs: CalculInputs
): CalcSavingResult | null {
  if (!selectedProduct) {
    return null;
  }

  const expectedProfit = calculateExpectedProfit(calcInputs.monthlyAmount, calcInputs.term, selectedProduct.annualRate);
  const difference = calculateDifferenceFromTarget(calcInputs.targetAmount, expectedProfit);
  const recommendedMonthly = calculateRecommendedMonthlyAmount(
    calcInputs.targetAmount,
    calcInputs.term,
    selectedProduct.annualRate
  );

  return {
    expectedProfit,
    difference,
    recommendedMonthly,
  };
}
