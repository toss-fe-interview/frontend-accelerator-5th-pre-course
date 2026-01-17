import { colors, ListRow } from 'tosslib';

interface CalculationResultItemProps {
  label: string;
  value: number;
}

export function CalculationResultItem({ label, value }: CalculationResultItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${value.toLocaleString('ko-KR')}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
