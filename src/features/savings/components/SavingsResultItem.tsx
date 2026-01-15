import { colors, ListRow } from 'tosslib';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsResultItemProps {
  label: string;
  value: number;
}

export default function SavingsResultItem({ label, value }: SavingsResultItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatNumberWithComma(value)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
