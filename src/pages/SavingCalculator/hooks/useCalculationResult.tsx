import { SavingsProduct } from '../api';
import { CalculInputs } from '../SavingsCalculatorPage';

interface CalculationResult {
  selectedProduct: SavingsProduct | null;
  calculInputs: CalculInputs;
}

export function useCalculationResult({ selectedProduct, calculInputs }: CalculationResult) {
  const { monthlyAmount, term, targetAmount } = calculInputs;
  const annualRate = selectedProduct?.annualRate ?? 0;
  const factor = 1 + annualRate * 0.5;

  const expectedProfit = monthlyAmount * term * factor;
  const difference = targetAmount - expectedProfit;
  const recommendedMonthly = term === 0 ? 0 : targetAmount / (term * factor);

  return {
    expectedProfit,
    difference,
    recommendedMonthly,
  };
}
