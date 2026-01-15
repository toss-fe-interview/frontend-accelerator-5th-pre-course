import { SavingsProduct } from 'entities/savings-product/model/types';
import { formatCurrency } from 'shared/lib/format';
import { Border, colors, ListRow, Spacing } from 'tosslib';
import {
  calculateDifference,
  calculateExpectedProfit,
  calculateRecommendedMonthlyAmount,
} from '../lib/calculate-savings';

interface CalculationResultProps {
  selectedProduct: SavingsProduct | null;
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

/*
- 예상 수익 금액
    - 공식: `최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)`
- 목표 금액과의 차이
    - 공식: `목표 금액과의 차이 = 목표 금액 - 예상 수익 금액`
- 추천 월 납입 금액
    - 공식: `월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))`
    - 1,000원 단위로 반올림
*/

const CalculationResult = ({ selectedProduct, targetAmount, monthlyAmount, term }: CalculationResultProps) => {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const expectedProfit = calculateExpectedProfit(monthlyAmount, term, selectedProduct.annualRate);
  const difference = calculateDifference(targetAmount, expectedProfit);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(targetAmount, term, selectedProduct.annualRate);

  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatCurrency(expectedProfit)}`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatCurrency(difference)}`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatCurrency(recommendedMonthlyAmount)}`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />
    </>
  );
};

export default CalculationResult;
