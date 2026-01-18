import { Assets, colors, ListRow } from 'tosslib';
import { formatAmount } from 'utils/format';

interface SavingsProductListItemProps {
  name: string;
  annualRate: number;
  monthlyAmountRange: {
    min: number;
    max: number;
  };
  availableTerms: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function SavingsProductListItem({
  name,
  annualRate,
  monthlyAmountRange,
  availableTerms,
  isSelected,
  onSelect,
}: SavingsProductListItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatAmount(monthlyAmountRange.min)}원 ~ ${formatAmount(monthlyAmountRange.max)}원 | ${availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={onSelect}
    />
  );
}
