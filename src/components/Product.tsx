import { colors, ListRow } from 'tosslib';

interface ProductProps {
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export const Product = ({ name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms }: ProductProps) => {
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
