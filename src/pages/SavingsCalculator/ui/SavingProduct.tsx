import { SavingsProduct } from 'shared/api/type';
import { colors, ListRow } from 'tosslib';

export const SavingProduct = ({
  name,
  annualRate,
  minMonthlyAmount,
  maxMonthlyAmount,
  availableTerms,
}: Omit<SavingsProduct, 'id'>) => {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${minMonthlyAmount.toLocaleString()}원 ~ ${maxMonthlyAmount.toLocaleString()}원 | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
};
