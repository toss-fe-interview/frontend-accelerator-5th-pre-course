import { Assets, colors, ListRow } from 'tosslib';

import { SavingsProduct } from 'types/SavingsProduct.type';
import { formatAmount } from 'utils/formatAmount';

interface SavingsProductListItemProps {
  savingsProduct: SavingsProduct;
  isSelected: boolean;
  handleSelectSavingsProduct: (savingsProduct: SavingsProduct | null) => void;
}

export function SavingsProductListItem({
  savingsProduct,
  isSelected,
  handleSelectSavingsProduct,
}: SavingsProductListItemProps) {
  const handleClick = () => {
    if (isSelected) {
      handleSelectSavingsProduct(null);
      return;
    }
    handleSelectSavingsProduct(savingsProduct);
  };
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={savingsProduct.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${savingsProduct.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatAmount(savingsProduct.minMonthlyAmount)}원 ~ ${formatAmount(savingsProduct.maxMonthlyAmount)}원 | ${savingsProduct.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={handleClick}
    />
  );
}
