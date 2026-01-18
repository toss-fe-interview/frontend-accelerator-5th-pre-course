import { colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'type';
import { formatMoney } from 'utils/money';

interface ProductInfoTextsProps {
  product: SavingsProduct;
}

export function ProductInfoTexts(props: ProductInfoTextsProps) {
  const { product } = props;

  const rangeText = `${formatMoney(product.minMonthlyAmount)}원 ~ ${formatMoney(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`;

  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={product.name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${product.annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={rangeText}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
