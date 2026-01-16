import { useMemo } from 'react';
import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import type { SavingsFormState, SavingsProduct } from 'shared/types';
import { formatNumber } from 'shared/utils';
import { SavingsProductListItem } from './SavingsProductListItem';

const SIMPLE_INTEREST_COEFFICIENT = 0.5;
const ROUNDING_UNIT = 1000;

interface CalculationResultProps {
  formState: SavingsFormState;
  selectedProduct: SavingsProduct | null;
  selectedProductId: string | null;
  recommendedProducts: SavingsProduct[];
}

export function CalculationResult({
  formState,
  selectedProduct,
  selectedProductId,
  recommendedProducts,
}: CalculationResultProps) {
  const { goalAmount, monthlyAmount, term } = formState;

  const calculationResult = useMemo(() => {
    if (selectedProduct === null) {
      return null;
    }

    const actualMonthlyAmount = monthlyAmount ?? 0;
    const annualRate = selectedProduct.annualRate / 100;
    const interestMultiplier = 1 + annualRate * SIMPLE_INTEREST_COEFFICIENT;

    const expectedProfit = actualMonthlyAmount * term * interestMultiplier;
    const goalDifference = goalAmount !== null ? goalAmount - expectedProfit : null;
    const recommendedMonthlyAmount =
      goalAmount !== null ? Math.round(goalAmount / (term * interestMultiplier) / ROUNDING_UNIT) * ROUNDING_UNIT : null;

    return { expectedProfit, goalDifference, recommendedMonthlyAmount };
  }, [selectedProduct, monthlyAmount, term, goalAmount]);

  if (selectedProduct === null || calculationResult === null) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const { expectedProfit, goalDifference, recommendedMonthlyAmount } = calculationResult;

  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(expectedProfit ?? 0)}원`}
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
            bottom={`${formatNumber(goalDifference ?? 0)}원`}
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
            bottom={`${formatNumber(recommendedMonthlyAmount ?? 0)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendedProducts.map(product => (
        <SavingsProductListItem key={product.id} product={product} isSelected={selectedProductId === product.id} />
      ))}

      <Spacing size={40} />
    </>
  );
}
