import { colors, ListRow } from 'tosslib';
import { formatNumber } from 'utils/format';

interface SavingsProductInfoProps {
  상품명: string;
  가입조건: {
    금리: number;
    납입범위: { min: number; max: number };
    가입기간: number;
  };
}

export default function SavingsProductInfo({ 상품명, 가입조건 }: SavingsProductInfoProps) {
  const { 금리, 납입범위, 가입기간 } = 가입조건;

  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={상품명}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${금리}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${formatNumber(납입범위.min)}원 ~ ${formatNumber(납입범위.max)}원 | ${가입기간}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
}
