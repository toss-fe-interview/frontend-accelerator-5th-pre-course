import { ListRow, colors } from 'tosslib';
import { SavingsProduct } from '../schemas/savingsProduct';
import { formatNumberWithComma } from '../utils/format/number';

// what : 적금 상품의 정보를 표시. 향후 해당 데이터 외에 적금 상품에 대한 추가 정보를 보여달라는 요구사항도 생길 수 있음. 그래서 product 자체를 넘김
interface SavingsProductProps {
  savingsProduct: SavingsProduct;
}

export default function SavingsProductItem({ savingsProduct }: SavingsProductProps) {
  const { name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${formatNumberWithComma(minMonthlyAmount)}원 ~ ${formatNumberWithComma(maxMonthlyAmount)}원 | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
