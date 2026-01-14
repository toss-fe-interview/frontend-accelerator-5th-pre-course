import { SavingsProduct } from 'api/savings-products/types';
import { Assets, ListRow, colors } from 'tosslib';
import { formatNumberToKo } from 'utils/formatting';

interface SavingsProductItemProps {
  product: SavingsProduct;
  selectedProductId: string | null | undefined;
  onClick: () => void;
}

export default function SavingsProductItem({ product, selectedProductId, onClick }: SavingsProductItemProps) {
  const isSelected = selectedProductId === product.id;

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatNumberToKo(product.minMonthlyAmount)}원 ~ ${formatNumberToKo(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={onClick}
    />
  );
}
