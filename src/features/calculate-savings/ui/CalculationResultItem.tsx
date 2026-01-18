import { formatCurrency } from 'shared/lib/format';
import { colors, ListRow } from 'tosslib';

interface CalculationResultItemProps {
  label: string;
  value: number;
}

const CalculationResultItem = ({ label, value }: CalculationResultItemProps) => {
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
};

export default CalculationResultItem;
