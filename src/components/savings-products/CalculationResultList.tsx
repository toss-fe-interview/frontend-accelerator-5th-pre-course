import { SavingsProduct } from 'api/savings-products/types';
import { colors, ListRow } from 'tosslib';
import { calculateDiffTargetAmount, calculateExpecteProfit, calculateSuggestMonthlyPayment } from 'utils/calculate';
import { formatNumberToKo } from 'utils/formatting';

interface CalculattionResultListProps {
  selectedProduct: SavingsProduct;
  targetAmount: number;
  monthlyPayment: number;
}

export default function CalculattionResultList({
  selectedProduct,
  targetAmount,
  monthlyPayment,
}: CalculattionResultListProps) {
  const expecteProfit = calculateExpecteProfit({
    availableTerms: selectedProduct.availableTerms,
    annualRate: selectedProduct.annualRate,
    monthlyPayment: monthlyPayment,
  });

  const diffTargetAmount = calculateDiffTargetAmount({
    targetAmount,
    expecteProfit,
  });

  const suggestMonthlyAmount = calculateSuggestMonthlyPayment({
    availableTerms: selectedProduct.availableTerms,
    annualRate: selectedProduct.annualRate,
    targetAmount,
  });

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
