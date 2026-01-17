import { colors, ListRow } from 'tosslib';

interface CalculationResultItemProps {
  name: string;
  amount: number;
}

export function CalculationResultItem({ name, amount }: CalculationResultItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={name}
          topProps={{ color: colors.grey600 }}
          bottom={`${amount.toLocaleString('ko-KR')}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
