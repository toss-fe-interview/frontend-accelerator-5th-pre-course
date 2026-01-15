import { Assets, colors, ListRow } from 'tosslib';
import { ProductItem } from './ProductsContainer';

interface ProductListProps {
  // 필터된 products
  products: ProductItem[];
  onClickProduct: (id: string) => void;
}

export default function ProductList({ products, onClickProduct }: ProductListProps) {
  // 선택 기능.
  // 렌더링
  return (
    <>
      {products.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={'100,000원 ~ 500,000원 | 12개월'}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={product.isSelected && <Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {
            onClickProduct(product.id);
          }}
        />
      ))}
    </>
  );
}
