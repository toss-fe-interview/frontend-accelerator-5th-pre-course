import { colors, ListRow } from 'tosslib';
import { formatNumber } from 'utils/format';
import type { SavingsProduct } from '../api/api';

export default function ProductItem({
  product,
  right,
  onProductSelect,
}: {
  product: SavingsProduct;
  right: React.ReactNode;
  onProductSelect: () => void;
}) {
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
          bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={right}
      onClick={onProductSelect}
    />
  );
}
