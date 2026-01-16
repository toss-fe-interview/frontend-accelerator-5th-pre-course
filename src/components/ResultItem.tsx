import { colors, ListRow } from 'tosslib';

interface ResultItemProps {
  label: string;
  value: number;
}

export function ResultItem({ label, value }: ResultItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${value.toLocaleString()}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
