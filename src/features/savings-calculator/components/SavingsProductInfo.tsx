import { colors, ListRow } from 'tosslib';
import { formatNumber } from 'utils/format';
import type { SavingsProduct } from '../api/schema';

interface SavingsProductInfoProps {
  product: SavingsProduct;
}

export default function SavingsProductInfo({ product }: SavingsProductInfoProps) {
  const minMonthlyAmount = formatNumber(product.minMonthlyAmount);
  const maxMonthlyAmount = formatNumber(product.maxMonthlyAmount);
  const availableTerms = product.availableTerms;

  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={product.name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${product.annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${minMonthlyAmount}원 ~ ${maxMonthlyAmount}원 | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
