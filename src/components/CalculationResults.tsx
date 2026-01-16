import { SavingsInput, SavingsProduct } from 'type';
import { colors, ListRow } from 'tosslib';
import { formatMoney } from 'utils/money';
import {
  calculateExpectedAmount,
  calculateGoalDifference,
  calculateRecommendedMonthlyAmount,
} from 'utils/savingsCalculator';

interface CalculationResultsProps {
  selectedProduct: SavingsProduct;
  savingsInput: SavingsInput;
}

export function CalculationResults(props: CalculationResultsProps) {
  const { selectedProduct, savingsInput } = props;

  const annualRate = selectedProduct.annualRate / 100;

  const expectedAmount = calculateExpectedAmount(savingsInput.monthlyAmount, savingsInput.term, annualRate);
  const goalDifference = calculateGoalDifference(savingsInput.goalAmount, expectedAmount);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    savingsInput.goalAmount,
    savingsInput.term,
    annualRate
  );

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatMoney(Math.round(expectedAmount))}원`}
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
            bottom={`${goalDifference >= 0 ? '+' : ''}${formatMoney(Math.round(goalDifference))}원`}
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
            bottom={`${formatMoney(recommendedMonthlyAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
