import { formatPrice } from 'shared/utils/price';
import { ListRow, colors } from 'tosslib';

type SavingProductItemProps = {
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export const SavingProductItem = ({
  name,
  annualRate,
  minMonthlyAmount,
  maxMonthlyAmount,
  availableTerms,
}: SavingProductItemProps) => {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${formatPrice(minMonthlyAmount)}원 ~ ${formatPrice(maxMonthlyAmount)}원 | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
};
