import { colors, ListRow } from 'tosslib';

import { formatAmount } from 'shared/lib/formatAmount';

interface CalculationResultAmountProps {
  label: string;
  amount: number;
}

export function CalculationResultAmount({ label, amount }: CalculationResultAmountProps) {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      topProps={{ color: colors.grey600 }}
      bottom={`${formatAmount(amount)}원`}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
}
