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
  const { data: products } = useSavingsProductsQuery({
    filters: [product => product.id === selectedProductId],
  });

  const selectedProduct = products.length > 0 ? products[0] : null;

  const missingField = getMissingField({
    hasProduct: selectedProduct !== null,
    hasTargetAmount: targetAmount !== null,
    hasTerm: selectedTerm !== null,
    hasMonthlyAmount: monthlyAmount !== null,
  });

  if (missingField !== null) {
    return <ValidationMessage missingField={missingField} />;
  }

  return (
    <CalculationResultContent
      monthlyAmount={monthlyAmount!}
      term={selectedTerm!}
      rate={selectedProduct!.annualRate}
      targetAmount={targetAmount!}
    />
  );
}

type MissingField = 'product' | 'targetAmount' | 'term' | 'monthlyAmount';

function getMissingField({
  hasProduct,
  hasTargetAmount,
  hasTerm,
  hasMonthlyAmount,
}: {
  hasProduct: boolean;
  hasTargetAmount: boolean;
  hasTerm: boolean;
  hasMonthlyAmount: boolean;
}): MissingField | null {
  if (!hasProduct) {
    return 'product';
  }
  if (!hasTargetAmount) {
    return 'targetAmount';
  }
  if (!hasTerm) {
    return 'term';
  }
  if (!hasMonthlyAmount) {
    return 'monthlyAmount';
  }
  return null;
}

const VALIDATION_MESSAGES: Record<MissingField, string> = {
  product: '상품을 선택해주세요.',
  targetAmount: '목표 금액을 입력해주세요.',
  term: '저축 기간을 선택해주세요.',
  monthlyAmount: '월 납입액을 입력해주세요.',
};

function ValidationMessage({ missingField }: { missingField: MissingField }) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={VALIDATION_MESSAGES[missingField]} />} />;
}

interface CalculationParams {
  monthlyAmount: number;
  term: number;
  rate: number;
  targetAmount: number;
}

function CalculationResultContent({ monthlyAmount, term, rate, targetAmount }: CalculationParams) {
  const expectedRevenue = calculateExpectedRevenue(monthlyAmount, term, rate);
  const diffFromTarget = calculateDiffFromTarget(targetAmount, expectedRevenue);
  const recommendedAmount = calculateRecommendedMonthlyAmount(targetAmount, term, rate);

  return (
    <>
      <ResultRow label="예상 수익" value={`${expectedRevenue.toLocaleString()}원`} />
      <ResultRow label="목표 금액과의 차이" value={formatDifference(diffFromTarget)} />
      <ResultRow label="추천 월 납입액" value={`${recommendedAmount.toLocaleString()}원`} />
    </>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          bottom={value}
          bottomProps={{ color: colors.blue600, fontWeight: 'bold' }}
        />
      }
    />
  );
}
