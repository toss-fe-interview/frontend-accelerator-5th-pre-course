import type { SavingProduct } from 'product/type/internal';
import { Assets, colors, ListRow } from 'tosslib';

interface Props {
  product: SavingProduct;
  onClick?: () => void;
  selected: boolean;
}

const SavingProduct = ({ product, onClick, selected }: Props) => {
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
          bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={() => onClick?.()}
    />
  );
};

export default SavingProduct;
