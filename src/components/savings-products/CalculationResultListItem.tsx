import { colors, ListRow } from 'tosslib';

interface CalculattionResultListItemProps {
  listLabel: string;
  calculationResult: string;
}

export default function CalculattionResultListItem({ listLabel, calculationResult }: CalculattionResultListItemProps) {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={listLabel}
      topProps={{ color: colors.grey600 }}
      bottom={calculationResult}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
}
