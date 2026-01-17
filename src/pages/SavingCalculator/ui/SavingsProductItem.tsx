import { colors, ListRow } from 'tosslib';

interface SavingsProductItemProps {
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export const SavingsProductItem = ({
  name,
  annualRate,
  minMonthlyAmount,
  maxMonthlyAmount,
  availableTerms,
}: SavingsProductItemProps) => {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
};
