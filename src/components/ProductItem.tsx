import { SavingsProduct } from 'api';
import { Assets, colors, ListRow } from 'tosslib';

interface ProductItemProps {
  product: SavingsProduct;
  isSelected: boolean;
  onSelect: (productId: string) => void;
}
export function ProductItem({ product, isSelected, onSelect }: ProductItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${product.minMonthlyAmount}원 ~ ${product.maxMonthlyAmount}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      onClick={() => onSelect(product.id)}
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
    />
  );
}
