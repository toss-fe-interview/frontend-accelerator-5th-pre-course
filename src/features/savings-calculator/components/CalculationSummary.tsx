import { colors, ListRow } from 'tosslib';
import { formatNumber } from 'utils/format';
import { roundToThousand } from 'utils/roundToThousand';
import type { SavingsProduct } from '../api/api';
import { useCalculatorParams } from '../hooks/useCalculatorParams';

export default function CalculationSummary({ product }: { product: SavingsProduct }) {
  const { targetAmount, monthlyAmount, savingTerms } = useCalculatorParams();

  if (!savingTerms) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="저축 기간을 선택해주세요." />} />;
  }

  const expectedProfit = calculateExpectedProfit(monthlyAmount ?? 0, savingTerms, product.annualRate);
  const differenceAmount = (targetAmount ?? 0) - expectedProfit;
  const recommendedMonthlyAmount = roundToThousand(
    calculateMonthlyAmount(targetAmount ?? 0, savingTerms, product.annualRate)
  );

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(expectedProfit)}원`}
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
            bottom={`${formatNumber(differenceAmount)}원`}
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
            bottom={`${formatNumber(recommendedMonthlyAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}

const calculateExpectedProfit = (monthlyAmount: number, savingTerms: number, annualRate: number) => {
  return monthlyAmount * savingTerms * (1 + (annualRate / 100) * 0.5);
};

const calculateMonthlyAmount = (targetAmount: number, savingTerms: number, annualRate: number) => {
  return targetAmount / (savingTerms * (1 + (annualRate / 100) * 0.5));
};
