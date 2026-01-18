import { toCurrencyWon } from 'shared/utils/format';
import { colors, ListRow } from 'tosslib';
import { SavingsProductType } from 'shared/types/api/savings';

interface SavingsProductProps {
  product: SavingsProductType;
}

export default function SavingsProduct({ product }: SavingsProductProps) {
  const { name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms } = product;

  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${toCurrencyWon(minMonthlyAmount)} ~ ${toCurrencyWon(maxMonthlyAmount)} | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
