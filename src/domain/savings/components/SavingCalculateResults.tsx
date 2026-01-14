import { colors, ListRow } from 'tosslib';

interface Props {
  expectedProfit: number | null;
  diffBetweenGoalAndExpectedProfit: number | null;
  recommendedMonthlyAmount: number | null;
}

export const SavingCalculateResults = ({
  expectedProfit,
  diffBetweenGoalAndExpectedProfit,
  recommendedMonthlyAmount,
}: Props) => {
  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={expectedProfit ? `${expectedProfit}원` : '??'}
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
            bottom={diffBetweenGoalAndExpectedProfit ? `${diffBetweenGoalAndExpectedProfit}원` : '??'}
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
            bottom={recommendedMonthlyAmount ? `${recommendedMonthlyAmount}원` : '??'}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
};
