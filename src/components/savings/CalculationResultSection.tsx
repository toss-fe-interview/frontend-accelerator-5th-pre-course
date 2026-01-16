import { colors, ListRow, Spacing } from 'tosslib';
import { SavingsGoalEstimate } from 'hooks/useSavingsGoalEstimate';
import { formatNumber } from 'utils/format';

interface CalculationResultSectionProps {
  estimate: SavingsGoalEstimate | null;
}

export function CalculationResultSection({ estimate }: CalculationResultSectionProps) {
  if (!estimate) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(Math.round(estimate.expectedAmount))}원`}
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
            bottom={`${formatNumber(Math.round(estimate.gapFromTarget))}원`}
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
            bottom={`${formatNumber(estimate.suggestedDeposit)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
