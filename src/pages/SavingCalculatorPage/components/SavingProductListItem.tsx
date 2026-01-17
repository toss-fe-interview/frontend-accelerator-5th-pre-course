import { SavingProduct } from 'models/SavingProduct';
import { Assets, colors, ListRow } from 'tosslib';
import { priceFormatterToLocaleString } from 'utils/priceFormatter';

interface SavingProductListItemProps {
  product: SavingProduct;
  isSelected: boolean;
  onSelect: (product: SavingProduct) => void;
}

export function SavingProductListItem({ product, isSelected, onSelect }: SavingProductListItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${priceFormatterToLocaleString(product.minMonthlyAmount)}원 ~ ${priceFormatterToLocaleString(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={() => onSelect(product)}
    />
  );
}
