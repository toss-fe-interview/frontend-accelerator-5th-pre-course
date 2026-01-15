import { Assets, colors, ListRow } from 'tosslib';
import { type ProductItem } from 'types/products';

interface ProductItemProps {
  product: ProductItem;
  isActive?: boolean;
}

export default function Product({ product, isActive }: ProductItemProps) {
  return (
    <ListRow
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: 3.2%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`100,000원 ~ 500,000원 | 12개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isActive && <Assets.Icon name="icon-check-circle-green" />}
    />
  );
}
