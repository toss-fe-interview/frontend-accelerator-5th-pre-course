import { colors, ListRow } from 'tosslib';

interface Props {
  label: string;
  value: string;
}

export function CalculationResultItem({ label, value }: Props) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={value}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
