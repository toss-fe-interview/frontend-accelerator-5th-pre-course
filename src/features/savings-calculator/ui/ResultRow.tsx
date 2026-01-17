import { colors, ListRow } from 'tosslib';
import { formatCurrency } from 'shared/utils/format';

export function ResultRow({ label, value }: { label: string; value: number }) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={formatCurrency(value)}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
