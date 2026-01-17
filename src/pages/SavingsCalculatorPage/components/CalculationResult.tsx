import { formatCurrency, formatDifference } from 'utils/format';
import { SavingsProduct } from '../models/savings-products.dto';
import { SavingsCalculatorTerm, SavingsFilterForm } from '../types/saving-filter-form';

type CalculationResultData = {
  expectedAmount: string;
  difference: string;
  recommendedMonthlyPayment: string;
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

  // 해당 부분 읽기에 불편한가?? how 인가?
  // const 하나라도입안하면 =
  if (!targetAmount || !monthlyPayment || !term) {
    return children({ type: 'requiredInputEmpty' });
  }

  // 여기 인자도, filter 로 구분하는게 좋을거 같음, 인자 개념이 다른데 평탄화 되어 있는 느낌
  const expectedAmount = calculateExpectedAmount(monthlyPayment, term, selectedProduct.annualRate);
  const difference = targetAmount - expectedAmount;
  // 여기도 filter 로 구분하는게 조을거 같음
  const recommendedMonthlyPayment = calculateRecommendedMonthly(targetAmount, term, selectedProduct.annualRate);

  return children({
    type: 'success',
    result: {
      expectedAmount: `${formatCurrency(Math.round(expectedAmount))}원`,
      difference: `${formatDifference(Math.round(difference))}원`,
      recommendedMonthlyPayment: `${formatCurrency(recommendedMonthlyPayment)}원`,
    },
  });
}

// calcuate 로직도 개선 포인트가 되지 않을까?? 싶음
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
