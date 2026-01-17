import { SavingsProduct } from 'model/types';
import { useSearchParams } from 'react-router-dom';
import { Assets, colors, ListRow } from 'tosslib';

const SavingsProductItem = ({
  product,
  isSelected,
  onSelect,
}: {
  product: SavingsProduct;
  isSelected: boolean;
  onSelect?: (product: SavingsProduct) => void;
}) => {
  const [searchParams] = useSearchParams();
  const productOption = `${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`;
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
          bottom={productOption}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={() => {
        if (!searchParams.get('monthlyAmount') || searchParams.get('period') === '0') {
          return;
        }
        onSelect?.(product);
      }}
    />
  );
};

export default SavingsProductItem;
