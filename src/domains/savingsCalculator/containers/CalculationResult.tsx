import { Border, ListRow, Spacing } from 'tosslib';
import CalculationSummary from '../components/CalculationSummary';
import RecommendSavingsList from './RecommendSavingsList';
import { SavingsProductType } from 'shared/types/api/savings';
import {
  calculateDiffFromTargetAmount,
  calculateExpcedProfit,
  calculateRecommendedMonthlyPayment,
  round1000,
} from '../utils/calculate';

interface CalculationResultProps {
  userInputs: {
    targetAmount: number;
    monthlyPayment: number;
    term: number;
  };
  selectedProduct: SavingsProductType | null;
}

export default function CalculationResult({ userInputs, selectedProduct }: CalculationResultProps) {
  const { targetAmount, monthlyPayment, term } = userInputs;
  const { annualRate = 0 } = selectedProduct ?? {};

  const expectedProfit = calculateExpcedProfit({ monthlyPayment: Number(monthlyPayment), term, annualRate });
  const diffFromTargetAmount = calculateDiffFromTargetAmount({ targetAmount: Number(targetAmount), expectedProfit });
  const recommendedMonthlyPayment = round1000(
    calculateRecommendedMonthlyPayment({
      targetAmount: Number(targetAmount),
      term,
      annualRate,
    })
  );

  return (
    <>
      <Spacing size={8} />

      {selectedProduct ? (
        <CalculationSummary
          expectedProfit={expectedProfit}
          differenceFromTargetAmount={diffFromTargetAmount}
          recommendedMonthlyPayment={recommendedMonthlyPayment}
        />
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <RecommendSavingsList
        selectedId={selectedProduct?.id}
        userInputs={{
          term,
          monthlyPayment: Number(monthlyPayment),
        }}
      />
    </>
  );
}
