import { ListRow, colors, Assets } from 'tosslib';
import { SavingsProduct } from '../types';
import { formatPrice } from 'shared/utils/price';

type SavingsProductItemProps = {
  product: SavingsProduct;
  selected: boolean;
  onSelect: () => void;
};

export const SavingsProductItem = ({ product, selected, onSelect }: SavingsProductItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatPrice(product.minMonthlyAmount)}원 ~ ${formatPrice(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={onSelect}
    />
  );
};
