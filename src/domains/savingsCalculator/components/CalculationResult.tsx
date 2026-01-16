import { formatCurrency } from 'shared/utils/format';
import { colors, ListRow } from 'tosslib';

interface CalculationResultProps {
  label: string;
  value: number;
}

export default function CalculationResult({ label, value }: CalculationResultProps) {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      topProps={{ color: colors.grey600 }}
      bottom={`${formatCurrency(value)}원`}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
}
