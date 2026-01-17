import {
  calculateDiffFromTarget,
  calculateExpectedRevenue,
  calculateRecommendedMonthlyAmount,
} from 'domains/product/calculations';
import { useSavingsProductsQuery } from 'hooks/useSavingsProductsQuery';
import { useSavingsQueryParams } from 'hooks/useSavingsQueryParams';
import { useSelectedProductId } from 'hooks/useSelectedProductId';
import { ReactNode } from 'react';
import { colors, ListRow } from 'tosslib';

type MissingField = 'product' | 'targetAmount' | 'monthlyAmount';

const VALIDATION_MESSAGES: Record<MissingField, string> = {
  product: '상품을 선택해주세요.',
  targetAmount: '목표 금액을 입력해주세요.',
  monthlyAmount: '월 납입액을 입력해주세요.',
};

interface CalculationParams {
  monthlyAmount: number;
  term: number;
  rate: number;
  targetAmount: number;
}

interface ValidationInput {
  selectedProduct: { annualRate: number } | null;
  targetAmount: number | null;
  term: number;
  monthlyAmount: number | null;
}

type ValidationResult = { isValid: false; missingField: MissingField } | { isValid: true; params: CalculationParams };

function validateCalculationParams({
  selectedProduct,
  targetAmount,
  term,
  monthlyAmount,
}: ValidationInput): ValidationResult {
  if (selectedProduct === null) {
    return { isValid: false, missingField: 'product' };
  }
  if (targetAmount === null) {
    return { isValid: false, missingField: 'targetAmount' };
  }
  if (monthlyAmount === null) {
    return { isValid: false, missingField: 'monthlyAmount' };
  }
  return {
    isValid: true,
    params: { monthlyAmount, term, rate: selectedProduct.annualRate, targetAmount },
  };
}

export interface CalculationResultData {
  expectedRevenue: number;
  diffFromTarget: number;
  recommendedAmount: number;
}

export interface CalculationResultRenderProps {
  isValid: true;
  data: CalculationResultData;
}

export interface CalculationResultInvalidProps {
  isValid: false;
  validationMessage: string;
}

type RenderProps = CalculationResultRenderProps | CalculationResultInvalidProps;

interface CalculationResultProps {
  children: (props: RenderProps) => ReactNode;
}

export function CalculationResult({ children }: CalculationResultProps) {
  const [selectedProductId] = useSelectedProductId();
  const [{ targetAmount, monthlyAmount, selectedTerm }] = useSavingsQueryParams();
  const { data: products } = useSavingsProductsQuery({
    filters: [product => product.id === selectedProductId],
  });

  const selectedProduct = products.length > 0 ? products[0] : null;

  const validation = validateCalculationParams({
    selectedProduct,
    targetAmount,
    term: selectedTerm ?? 12,
    monthlyAmount,
  });

  if (!validation.isValid) {
    return <>{children({ isValid: false, validationMessage: VALIDATION_MESSAGES[validation.missingField] })}</>;
  }

  const { monthlyAmount: amount, term, rate, targetAmount: target } = validation.params;
  const expectedRevenue = calculateExpectedRevenue(amount, term, rate);
  const diffFromTarget = calculateDiffFromTarget(target, expectedRevenue);
  const recommendedAmount = calculateRecommendedMonthlyAmount(target, term, rate);

  return (
    <>
      {children({
        isValid: true,
        data: {
          expectedRevenue,
          diffFromTarget,
          recommendedAmount,
        },
      })}
    </>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
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

export function ValidationMessage({ message }: { message: string }) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
}
