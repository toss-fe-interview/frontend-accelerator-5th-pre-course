import { colors, ListRow } from 'tosslib';

import { SavingsCalculatorFormState } from 'types/SavingsCalculatorFormState';
import { SavingsProduct } from 'types/SavingsProduct.type';
import {
  calculateDifferenceAmount,
  calculateFinalAmount,
  calculateRecommendedMonthlyAmount,
} from 'utils/calculationUtil';
import { formatAmount } from 'utils/formatAmount';

interface CalculationResultProps {
  formState: SavingsCalculatorFormState;
  selectedSavingsProduct: SavingsProduct;
}

export function CalculationResult({ formState, selectedSavingsProduct }: CalculationResultProps) {
  const finalAmount = calculateFinalAmount(formState.monthlyAmount, formState.term, selectedSavingsProduct.annualRate);
  const differenceAmount = calculateDifferenceAmount(formState.targetAmount, finalAmount);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    formState.targetAmount,
    formState.term,
    selectedSavingsProduct.annualRate
  );
  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(finalAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(differenceAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(recommendedMonthlyAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
