import { colors, ListRow } from 'tosslib';

import { SavingsProduct } from 'entities/savings/model/types';

import { formatAmount } from 'shared/lib/formatAmount';

interface SavingsProductInfoProps {
  product: SavingsProduct;
}

export function SavingsProductInfo({ product }: SavingsProductInfoProps) {
  const { name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms } = product;
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${formatAmount(minMonthlyAmount)}원 ~ ${formatAmount(maxMonthlyAmount)}원 | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
