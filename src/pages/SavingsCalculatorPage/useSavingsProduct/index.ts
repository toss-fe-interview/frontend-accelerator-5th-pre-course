import { useMemo, useState } from 'react';
import { useSavingsProductsQuery } from './api';
import { SavingsProduct } from './types';

/**
 * 적금 계산기 페이지의 상태 및 비즈니스 로직을 관리하는 훅
 *
 * @description
 * - React Query로 적금 상품 데이터를 조회하고
 * - useState로 사용자 입력 상태를 관리하며
 * - useMemo로 파생 상태를 계산합니다
 *
 * @usage
 * **권장**: 페이지 최상위 컴포넌트에서 한 번만 호출하고 props로 전달
 * ```tsx
 * function SavingsCalculatorPage() {
 *   const savingsProduct = useSavingsProduct();
 *   return <ChildComponent {...savingsProduct} />;
 * }
 * ```
 *
 * @note
 * - 여러 컴포넌트에서 독립적으로 호출하면 각자 독립된 상태를 가짐 (상태 공유 안 됨)
 * - React Query는 캐싱되므로 API 중복 호출은 발생하지 않음
 * - 파생 상태 계산 비용은 무시할 수 있는 수준 (~0.1ms)
 * - 상태 공유가 필요하면 Context나 상태 관리 라이브러리 도입 고려
 */
export const useSavingsProduct = () => {
  // 1. API로 products 조회
  const { data: products } = useSavingsProductsQuery();

  // 2. 기본 상태 관리
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);
  const [savingsTerm, setSavingsTerm] = useState<number>(12);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  // 3. 파생 상태 1: 필터된 상품 목록
  const filteredProducts = useMemo(() => {
    // 월 납입액이 없으면 빈 배열 반환
    if (monthlyAmount === null) {
      return [];
    }

    return products.filter((product) => {
      // 월 납입액 조건: minMonthlyAmount보다 크고 maxMonthlyAmount보다 작아야 함
      const matchesMonthlyAmount =
        monthlyAmount >= product.minMonthlyAmount &&
        monthlyAmount <= product.maxMonthlyAmount;

      // 저축 기간 조건: availableTerms와 동일해야 함
      const matchesTerm = product.availableTerms === savingsTerm;

      return matchesMonthlyAmount && matchesTerm;
    });
  }, [products, monthlyAmount, savingsTerm]);

  // 4. 파생 상태 2: 예상 수익 금액
  // 공식: 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
  const expectedRevenue = useMemo(() => {
    // 선택한 상품이 없거나 월 납입액이 없으면 null
    if (selectedProduct === null || monthlyAmount === null) {
      return null;
    }

    const annualRateDecimal = selectedProduct.annualRate / 100;
    const revenue = monthlyAmount * savingsTerm * (1 + annualRateDecimal * 0.5);

    return Math.round(revenue);
  }, [selectedProduct, monthlyAmount, savingsTerm]);

  // 5. 파생 상태 3: 목표 금액과의 차이
  // 공식: 목표 금액 - 예상 수익 금액
  const targetDifference = useMemo(() => {
    // 예상 수익 금액이 null이거나 목표 금액이 null이면 null
    if (expectedRevenue === null || targetAmount === null) {
      return null;
    }

    return targetAmount - expectedRevenue;
  }, [targetAmount, expectedRevenue]);

  // 6. 파생 상태 4: 추천 월 납입 금액
  // 공식: 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
  // 1,000원 단위로 반올림
  const recommendedMonthlyAmount = useMemo(() => {
    // 선택한 상품이 없거나 목표 금액이 없으면 null
    if (selectedProduct === null || targetAmount === null) {
      return null;
    }

    const annualRateDecimal = selectedProduct.annualRate / 100;
    const amount = targetAmount / (savingsTerm * (1 + annualRateDecimal * 0.5));

    // 1,000원 단위로 반올림
    return Math.round(amount / 1000) * 1000;
  }, [targetAmount, selectedProduct, savingsTerm]);

  // 7. 파생 상태 5: 추천 상품 목록 (연이자율 상위 2개)
  const recommendedProducts = useMemo(() => {
    // 연이자율 기준 내림차순 정렬 후 상위 2개 반환
    return [...filteredProducts]
      .sort((a, b) => b.annualRate - a.annualRate)
      .slice(0, 2);
  }, [filteredProducts]);

  return {
    // 데이터
    products,
    filteredProducts,
    selectedProduct,
    recommendedProducts,

    // 상태
    targetAmount,
    monthlyAmount,
    savingsTerm,

    // 파생 상태
    expectedRevenue,
    targetDifference,
    recommendedMonthlyAmount,

    // Setters
    setTargetAmount,
    setMonthlyAmount,
    setSavingsTerm,
    setSelectedProduct,
  };
};

export type { SavingsProduct } from './types';
