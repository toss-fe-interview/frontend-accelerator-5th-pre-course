import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../api';
import { formatToKRW } from '../util';

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
    </>
  );
}

interface SavingItemProps {
  product: SavingsProduct;
  selectedProduct: SavingsProduct | null;
  onSelect: (product: SavingsProduct) => void;
}
export function SavingItem({ product, selectedProduct, onSelect }: SavingItemProps) {
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
          bottom={`${formatToKRW(product.minMonthlyAmount)}원 ~ ${formatToKRW(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={() => onSelect(product)}
    />
  );
}
