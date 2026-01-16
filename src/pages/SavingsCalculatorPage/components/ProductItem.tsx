import { formatCurrency } from 'utils/format';
import { SavingsProduct } from '../models/savings-products.dto';
import { Assets, colors, ListRow } from 'tosslib';

interface ProductItemProps {
  product: SavingsProduct;
  selectedProduct: SavingsProduct | null;
  onSelectProduct: (product: SavingsProduct) => void;
}

export function ProductItem({ product, selectedProduct, onSelectProduct }: ProductItemProps) {
  const 적금_한줄_요약 = `${formatCurrency(product.minMonthlyAmount)}원 ~ ${formatCurrency(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`;
  const isSelected = selectedProduct?.id === product.id;

  return (
    <ListRow
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={적금_한줄_요약}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={() => onSelectProduct(product)}
    />
  );
}
