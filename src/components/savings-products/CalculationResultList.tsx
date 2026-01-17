import { SavingsProduct } from 'api/savings-products/types';
import { colors, ListRow } from 'tosslib';
import { formatNumberToKo } from 'utils/formatting';

export interface CalculattionResultListProps {
  selectedProduct: SavingsProduct;
  targetAmount: number;
  monthlyPayment: number;
}

export default function CalculattionResultList({
  selectedProduct,
  targetAmount,
  monthlyPayment,
}: CalculattionResultListProps) {
  const expecteProfit = monthlyPayment * selectedProduct.availableTerms * (1 + selectedProduct.annualRate * 0.5);

  const diffTargetAmount = targetAmount - expecteProfit;

  const suggestMonthlyAmount =
    Math.round(targetAmount / (selectedProduct.availableTerms * (1 + selectedProduct.annualRate * 0.5)) / 1000) * 1000;

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumberToKo(expecteProfit)}원`}
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
            bottom={`${formatNumberToKo(diffTargetAmount)}원`}
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
            bottom={`${formatNumberToKo(suggestMonthlyAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
