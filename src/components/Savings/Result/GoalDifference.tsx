import { ListRow, colors } from 'tosslib';

interface GoalDifferenceProps {
  amount: number;
}

export function GoalDifference({ amount }: GoalDifferenceProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top="목표 금액과의 차이"
          topProps={{ color: colors.grey600 }}
          bottom={`${amount.toLocaleString()}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
