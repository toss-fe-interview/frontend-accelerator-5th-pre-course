import { colors, ListRow, Spacing } from 'tosslib';
import { formatCurrency } from 'shared/utils/format';

export function CalculationResults({
  expectedAmount,
  difference,
  recommendedMonthlyAmount,
}: {
  expectedAmount: number;
  difference: number;
  recommendedMonthlyAmount: number;
}) {
  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(expectedAmount)}
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
            bottom={formatCurrency(difference)}
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
            bottom={formatCurrency(recommendedMonthlyAmount)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
