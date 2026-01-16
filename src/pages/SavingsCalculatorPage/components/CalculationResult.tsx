import { SavingsProduct } from '../models/savings-products.dto';
import { SavingsCalculatorTerm, SavingsFilterForm } from '../types/saving-filter-form';

type CalculationResultData = {
  expectedAmount: number;
  difference: number;
  recommendedMonthlyPayment: number;
};

export type SavingsCalculation =
  | { type: 'productUnselected' }
  | { type: 'requiredInputEmpty' }
  | { type: 'success'; result: CalculationResultData };

interface Props {
  selectedProduct: SavingsProduct | null;
  filter: SavingsFilterForm;
  children: (calculation: SavingsCalculation) => React.ReactNode;
}

export function CalculationResult({ selectedProduct, filter, children }: Props) {
  const { targetAmount, monthlyPayment, term } = filter;

  if (!selectedProduct) {
    return children({ type: 'productUnselected' });
  }

  if (!targetAmount || !monthlyPayment || !term) {
    return children({ type: 'requiredInputEmpty' });
  }

  const expectedAmount = calculateExpectedAmount(monthlyPayment, term, selectedProduct.annualRate);
  const difference = targetAmount - expectedAmount;
  const recommendedMonthlyPayment = calculateRecommendedMonthly(targetAmount, term, selectedProduct.annualRate);

  return children({
    type: 'success',
    result: { expectedAmount, difference, recommendedMonthlyPayment },
  });
}

function calculateExpectedAmount(monthlyPayment: number, term: SavingsCalculatorTerm, annualRate: number): number {
  const 연이율 = annualRate / 100;
  const 적금평균이자기간비율 = 0.5;
  const 최종금액비율 = 1 + 연이율 * 적금평균이자기간비율;

  return monthlyPayment * term * 최종금액비율;
}

function calculateRecommendedMonthly(targetAmount: number, term: SavingsCalculatorTerm, annualRate: number): number {
  const 연이율 = annualRate / 100;
  const 적금평균이자기간비율 = 0.5;
  const 최종금액비율 = 1 + 연이율 * 적금평균이자기간비율;
  const 월납입금액반올림단위 = 1000;

  return Math.round(targetAmount / (term * 최종금액비율) / 월납입금액반올림단위) * 월납입금액반올림단위;
}
