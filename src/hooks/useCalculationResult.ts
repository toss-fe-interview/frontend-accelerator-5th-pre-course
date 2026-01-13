import { SavingsProduct } from './queries/types';

interface CalculationParams {
  selectedProduct: SavingsProduct | null;
  monthlyDeposit: string;
  targetAmount: string;
  term: number;
}

interface CalculationResult {
  expectedReturn: number;
  difference: number;
  recommendedDeposit: number;
}

export function useCalculationResult(params: CalculationParams): CalculationResult | null {
  const { selectedProduct, monthlyDeposit, targetAmount, term } = params;

  if (!selectedProduct) {
    return null;
  }

  const deposit = parseAmount(monthlyDeposit);
  const target = parseAmount(targetAmount);
  const annualRate = selectedProduct.annualRate / 100;

  const expectedReturn = calculateExpectedReturn(deposit, term, annualRate);

  return {
    expectedReturn,
    difference: calculateDifference(target, expectedReturn),
    recommendedDeposit: calculateRecommendedDeposit(target, term, annualRate),
  };
}

function parseAmount(value: string): number {
  return Number(value.replace(/,/g, '')) || 0;
}

function calculateExpectedReturn(deposit: number, term: number, annualRate: number): number {
  return deposit * term * (1 + annualRate * 0.5);
}

function calculateDifference(target: number, expectedReturn: number): number {
  return target - expectedReturn;
}

function calculateRecommendedDeposit(target: number, term: number, annualRate: number): number {
  return Math.round(target / (term * (1 + annualRate * 0.5)) / 1000) * 1000;
}
