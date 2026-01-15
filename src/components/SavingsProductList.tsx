import { ListRow, colors, Assets } from 'tosslib';
import { SavingsProduct } from 'types/savings';
import { formatNumber } from 'utils/format.ts';

interface SavingsProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onProductSelect?: (productId: string) => void;
}

const SavingsProductList = ({ products, selectedProductId, onProductSelect }: SavingsProductListProps) => {
  return products.map(product => (
    <ListRow
      key={product.id}
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
      right={product.id === selectedProductId ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={() => onProductSelect?.(product.id)}
    />
  ));
};

export default SavingsProductList;
