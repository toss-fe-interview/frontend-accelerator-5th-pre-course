import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from 'shared/types';
import { formatNumber } from 'shared/utils';

interface SavingsProductListItemProps {
  product: SavingsProduct;
  isSelected: boolean;
  onSelect?: () => void;
}

export function SavingsProductListItem({ product, isSelected, onSelect }: SavingsProductListItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      onClick={onSelect}
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
    />
  );
}
