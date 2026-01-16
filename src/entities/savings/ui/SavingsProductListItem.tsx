import { Assets, colors, ListRow } from 'tosslib';

import { SavingsProduct } from 'entities/savings/model/types';

import { formatAmount } from 'shared/lib/formatAmount';

interface SavingsProductListItemProps {
  savingsProduct: SavingsProduct;
  isSelected: boolean;
  onSelectSavingsProduct: (savingsProduct: SavingsProduct | null) => void;
}

export function SavingsProductListItem({
  savingsProduct,
  isSelected,
  onSelectSavingsProduct,
}: SavingsProductListItemProps) {
  const { name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatAmount(minMonthlyAmount)}원 ~ ${formatAmount(maxMonthlyAmount)}원 | ${availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={() => onSelectSavingsProduct(isSelected ? null : savingsProduct)}
    />
  );
}
