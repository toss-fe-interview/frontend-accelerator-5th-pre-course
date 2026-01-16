import { colors, ListRow } from 'tosslib';
import { formatCurrency } from '../lib/formatCurrency';

export const SavingsCalculationSummary = ({ label, amount }: { label: string; amount: number }) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${formatCurrency(amount)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
};
