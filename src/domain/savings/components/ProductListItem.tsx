import { Assets, colors, ListRow } from 'tosslib';
import { commaizeNumber } from '@shared/utils';
import type { SavingsProduct } from '@savings/apis/type';

type ProductListItemProps = {
  savingsProduct: SavingsProduct;
  selected?: boolean;
  onClick?: (savingsProduct: SavingsProduct) => void;
};

export const ProductListItem = ({ savingsProduct, selected, onClick }: ProductListItemProps) => {
  const { name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${commaizeNumber(minMonthlyAmount)}원 ~ ${commaizeNumber(maxMonthlyAmount)}원 | ${availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={() => onClick?.(savingsProduct)}
    />
  );
};
