import { colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../api';
import { formatToKRW } from '../util';

export function SavingItem({ product }: { product: SavingsProduct }) {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={product.name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${product.annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${formatToKRW(product.minMonthlyAmount)}원 ~ ${formatToKRW(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
