import { SavingsProduct } from './queries/types';
import { parseFormattedAmount } from 'utils/number';

interface SavingsGoalParams {
  selectedProduct: SavingsProduct | null;
  monthlyDeposit: string;
  targetAmount: string;
  term: number;
}

export interface SavingsGoalEstimate {
  expectedAmount: number;
  gapFromTarget: number;
  suggestedDeposit: number;
}

export function useSavingsGoalEstimate(params: SavingsGoalParams): SavingsGoalEstimate | null {
  const { selectedProduct, monthlyDeposit, targetAmount, term } = params;

  if (!selectedProduct) {
    return null;
  }

  const deposit = parseFormattedAmount(monthlyDeposit);
  const target = parseFormattedAmount(targetAmount);
  const annualRate = selectedProduct.annualRate / 100;

  const expectedAmount = getExpectedSavingsAmount(deposit, term, annualRate);

  return {
    expectedAmount,
    gapFromTarget: getGapFromTarget(target, expectedAmount),
    suggestedDeposit: getSuggestedMonthlyDeposit(target, term, annualRate),
  };
}

function getExpectedSavingsAmount(deposit: number, term: number, annualRate: number): number {
  return deposit * term * (1 + annualRate * 0.5);
}

function getGapFromTarget(target: number, expectedAmount: number): number {
  return target - expectedAmount;
}

function getSuggestedMonthlyDeposit(target: number, term: number, annualRate: number): number {
  return Math.round(target / (term * (1 + annualRate * 0.5)) / 1000) * 1000;
}
