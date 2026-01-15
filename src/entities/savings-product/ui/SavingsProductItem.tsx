import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../model/types';
import { formatCurrency } from 'shared/lib/format';

interface SavingsProductItemProps {
  product: SavingsProduct;
  selected: boolean;
  onClick: () => void;
}

const SavingsProductItem = ({ product, selected, onClick }: SavingsProductItemProps) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatCurrency(product.minMonthlyAmount)} ~ ${formatCurrency(product.maxMonthlyAmount)} | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={onClick}
    />
  );
};

export default SavingsProductItem;
