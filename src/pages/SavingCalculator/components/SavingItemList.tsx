import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../api';

interface SavingItemListProps {
  products: SavingsProduct[];
  selectedProduct: SavingsProduct | null;
  onProductSelect: (product: SavingsProduct) => void;
}

export default function SavingItemList({ products, selectedProduct, onProductSelect }: SavingItemListProps) {
  return (
    <>
      {products.map(product => (
        <SavingItem key={product.id} product={product} selectedProduct={selectedProduct} onSelect={onProductSelect} />
      ))}
      {/* 선택된 적금 상품인 경우
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'기본 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={'연 이자율: 3.2%'}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={'100,000원 ~ 500,000원 | 12개월'}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        right={<Assets.Icon name="icon-check-circle-green" />}
        onClick={() => {}}
      />
      */}
    </>
  );
}

interface SavingItemProps {
  product: SavingsProduct;
  selectedProduct: SavingsProduct | null;
  onSelect: (product: SavingsProduct) => void;
}
function SavingItem({ product, selectedProduct, onSelect }: SavingItemProps) {
  const isSelected = selectedProduct?.id === product.id;
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={() => onSelect(product)}
    />
  );
}
