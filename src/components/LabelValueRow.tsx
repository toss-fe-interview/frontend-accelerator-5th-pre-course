import { colors, ListRow } from 'tosslib';
import { formatAmount } from 'utils/format';

export function LabelValueRow({ label, value }: { label: string; value: number | null }) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatAmount(value)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
