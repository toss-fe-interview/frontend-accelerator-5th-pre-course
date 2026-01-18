import { colors, ListRow } from 'tosslib';

interface ResultRowProps {
  label: string;
  displayValue: string;
}

export function ResultRow({ label, displayValue }: ResultRowProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={displayValue}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
