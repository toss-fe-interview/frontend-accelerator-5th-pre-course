import { atom } from 'jotai';
import { SavingsProduct } from './types';

// 기본 상태 atoms
export const targetAmountAtom = atom<number | null>(null);
export const monthlyAmountAtom = atom<number | null>(null);
export const savingsTermAtom = atom<number>(12);
export const selectedProductAtom = atom<SavingsProduct | null>(null);
export const allProductsAtom = atom<SavingsProduct[]>([]);

// 파생 상태 1: 필터된 상품 목록
export const filteredProductsAtom = atom((get) => {
  const allProducts = get(allProductsAtom);
  const monthlyAmount = get(monthlyAmountAtom);
  const savingsTerm = get(savingsTermAtom);

  // 월 납입액이 없으면 빈 배열 반환
  if (monthlyAmount === null) {
    return [];
  }

  return allProducts.filter((product) => {
    // 월 납입액 조건: minMonthlyAmount보다 크고 maxMonthlyAmount보다 작아야 함
    const matchesMonthlyAmount =
      monthlyAmount >= product.minMonthlyAmount &&
      monthlyAmount <= product.maxMonthlyAmount;

    // 저축 기간 조건: availableTerms와 동일해야 함
    const matchesTerm = product.availableTerms === savingsTerm;

    return matchesMonthlyAmount && matchesTerm;
  });
});

// 파생 상태 2: 예상 수익 금액
// 공식: 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
export const expectedRevenueAtom = atom((get) => {
  const selectedProduct = get(selectedProductAtom);
  const monthlyAmount = get(monthlyAmountAtom);
  const savingsTerm = get(savingsTermAtom);

  // 선택한 상품이 없거나 월 납입액이 없으면 null
  if (selectedProduct === null || monthlyAmount === null) {
    return null;
  }

  const annualRateDecimal = selectedProduct.annualRate / 100;
  const expectedRevenue =
    monthlyAmount * savingsTerm * (1 + annualRateDecimal * 0.5);

  return Math.round(expectedRevenue);
});

// 파생 상태 3: 목표 금액과의 차이
// 공식: 목표 금액 - 예상 수익 금액
export const targetDifferenceAtom = atom((get) => {
  const targetAmount = get(targetAmountAtom);
  const expectedRevenue = get(expectedRevenueAtom);

  // 예상 수익 금액이 null이거나 목표 금액이 null이면 null
  if (expectedRevenue === null || targetAmount === null) {
    return null;
  }

  return targetAmount - expectedRevenue;
});

// 파생 상태 4: 추천 월 납입 금액
// 공식: 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
// 1,000원 단위로 반올림
export const recommendedMonthlyAmountAtom = atom((get) => {
  const targetAmount = get(targetAmountAtom);
  const selectedProduct = get(selectedProductAtom);
  const savingsTerm = get(savingsTermAtom);

  // 선택한 상품이 없거나 목표 금액이 없으면 null
  if (selectedProduct === null || targetAmount === null) {
    return null;
  }

  const annualRateDecimal = selectedProduct.annualRate / 100;
  const recommendedAmount =
    targetAmount / (savingsTerm * (1 + annualRateDecimal * 0.5));

  // 1,000원 단위로 반올림
  return Math.round(recommendedAmount / 1000) * 1000;
});

// 파생 상태 5: 추천 상품 목록 (연이자율 상위 2개)
export const recommendedProductsAtom = atom((get) => {
  const filteredProducts = get(filteredProductsAtom);

  // 연이자율 기준 내림차순 정렬 후 상위 2개 반환
  return [...filteredProducts]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);
});
