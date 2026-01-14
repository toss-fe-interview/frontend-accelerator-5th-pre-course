import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'type';
import { formatMoney } from 'utils/money';

interface SavingsProductItemProps {
  product: SavingsProduct;
  selected?: boolean;
  onClick?: () => void;
}

export function SavingsProductItem(props: SavingsProductItemProps) {
  const { product, selected = false, onClick } = props;

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatMoney(product.minMonthlyAmount)}원 ~ ${formatMoney(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={onClick}
    />
  );
}
