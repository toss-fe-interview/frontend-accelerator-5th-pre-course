import {
  calculateDiffFromTarget,
  calculateExpectedRevenue,
  calculateRecommendedMonthlyAmount,
} from 'domains/product/calculations';
import { formatDifference } from 'domains/product/formatter';
import { useSavingsProductsQuery } from 'hooks/useSavingsProductsQuery';
import { useSavingsQueryParams } from 'hooks/useSavingsQueryParams';
import { useSelectedProductId } from 'hooks/useSelectedProductId';
import { colors, ListRow } from 'tosslib';

export function CalculationResult() {
  const [selectedProductId] = useSelectedProductId();
  const [{ targetAmount, monthlyAmount, selectedTerm }] = useSavingsQueryParams();
  const { data: products } = useSavingsProductsQuery({ filters: [product => product.id === selectedProductId] });

  const selectedProduct = products[0] ?? null;

  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  if (!targetAmount) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="목표 금액을 입력해주세요." />} />;
  }

  if (!selectedTerm) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="저축 기간을 선택해주세요." />} />;
  }

  const expectedRevenue = monthlyAmount
    ? calculateExpectedRevenue(monthlyAmount, selectedTerm, selectedProduct.annualRate)
    : null;
  const diffFromTarget = expectedRevenue !== null ? calculateDiffFromTarget(targetAmount, expectedRevenue) : null;
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    targetAmount,
    selectedTerm,
    selectedProduct.annualRate
  );

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익"
            bottom={expectedRevenue !== null ? `${expectedRevenue.toLocaleString()}원` : '-'}
            bottomProps={{ color: colors.blue600, fontWeight: 'bold' }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            bottom={diffFromTarget !== null ? formatDifference(diffFromTarget) : '-'}
            bottomProps={{ color: colors.blue600, fontWeight: 'bold' }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입액"
            bottom={`${recommendedMonthlyAmount.toLocaleString()}원`}
            bottomProps={{ color: colors.blue600, fontWeight: 'bold' }}
          />
        }
      />
    </>
  );
}
