import { SavingProduct } from 'models/SavingProduct';
import { colors, ListRow } from 'tosslib';
import { priceFormatterToString } from 'utils/priceFormatter';
import { roundToUnit } from 'utils/math';

interface CalculationResultProps {
  selectedSavingProduct: SavingProduct;
  targetAmount: number;
  monthlyPayment: number;
  term: number;
}
export const CalculationResult = ({
  selectedSavingProduct,
  targetAmount,
  monthlyPayment,
  term,
}: CalculationResultProps) => {
  const annualRate = selectedSavingProduct.annualRate / 100;
  const expectedProfit = monthlyPayment * term * (1 + annualRate * 0.5);
  const diffFromTargetAmount = targetAmount - expectedProfit;
  const recommendedMonthlyPayment = roundToUnit(targetAmount / (term * (1 + annualRate * 0.5)), 1000);

  return (
    <div>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${priceFormatterToString(expectedProfit)}원`}
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
            bottom={`${priceFormatterToString(diffFromTargetAmount)}원`}
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
            bottom={`${priceFormatterToString(recommendedMonthlyPayment)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </div>
  );
};
