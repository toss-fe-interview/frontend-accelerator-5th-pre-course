import { colors, ListRow } from 'tosslib';

interface ResultItemProps {
  label: string;
  value: string;
}

export default function ResultItem({ label, value }: ResultItemProps) {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      topProps={{ color: colors.grey600 }}
      bottom={value}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
}
