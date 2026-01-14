import { colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'types';
import { Term } from 'useSavingsProductFilters';

type Props = {
  targetSavingsProduct: SavingsProduct;
  parameters: {
    targetAmount: number;
    monthlyPayment: number;
    term: Term;
  };
};

export default function CalculationResult({
  targetSavingsProduct,
  parameters: { targetAmount, monthlyPayment, term },
}: Props) {
  const expectedProfit = monthlyPayment * term * (1 + targetSavingsProduct.annualRate * 0.5);
  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedProfit.toLocaleString('ko-KR')}원`}
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
            bottom={`${(targetAmount - expectedProfit).toLocaleString('ko-KR')}원`}
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
            bottom={`${Math.round(targetAmount / term / (1 + targetSavingsProduct.annualRate * 0.5)).toLocaleString('ko-KR')}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
