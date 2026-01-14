import { formatCurrency } from 'shared/utils/format';
import { Assets, colors, ListRow } from 'tosslib';

interface SavingsProductProps {
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
  selected?: boolean;
  onSelect?: () => void;
}

export default function SavingsProduct({
  name,
  annualRate,
  minMonthlyAmount,
  maxMonthlyAmount,
  availableTerms,
  selected = false,
  onSelect,
}: SavingsProductProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatCurrency(minMonthlyAmount)}원 ~ ${formatCurrency(maxMonthlyAmount)}원 | ${availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={onSelect}
    />
  );
}
