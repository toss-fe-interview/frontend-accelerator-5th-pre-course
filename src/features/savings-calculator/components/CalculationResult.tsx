import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import type { SavingsProduct } from 'shared/types';
import { formatNumber } from 'shared/utils';

interface CalculationResultData {
  expectedProfit: number;
  goalDifference: number | null;
  recommendedMonthlyAmount: number | null;
}

interface CalculationResultProps {
  selectedProduct: SavingsProduct | null;
  calculationResult: CalculationResultData | null;
  recommendedProducts: SavingsProduct[];
  selectedProductId: string | null;
}

export function CalculationResult({
  selectedProduct,
  calculationResult,
  recommendedProducts,
  selectedProductId,
}: CalculationResultProps) {
  if (selectedProduct === null || calculationResult === null) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(calculationResult.expectedProfit ?? 0)}원`}
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
            bottom={`${formatNumber(calculationResult.goalDifference ?? 0)}원`}
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
            bottom={`${formatNumber(calculationResult.recommendedMonthlyAmount ?? 0)}원`}
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
        <ListRow
          key={product.id}
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
        />
      ))}

      <Spacing size={40} />
    </>
  );
}
