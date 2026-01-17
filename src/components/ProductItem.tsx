import { Assets, colors, ListRow } from 'tosslib';
import { type ProductItem } from 'types/products';

interface ProductItemProps {
  product: ProductItem;
  isActive?: boolean;
  onClick: () => void;
}

export default function Product({ product, isActive, onClick }: ProductItemProps) {
  return (
    <ListRow
      onClick={onClick}
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${product.minMonthlyAmount.toLocaleString()}0원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isActive && <Assets.Icon name="icon-check-circle-green" />}
    />
  );
}
