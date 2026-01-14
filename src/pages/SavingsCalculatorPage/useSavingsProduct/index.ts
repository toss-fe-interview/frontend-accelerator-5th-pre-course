import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useSavingsProductsQuery } from './api';
import {
  allProductsAtom,
  expectedRevenueAtom,
  filteredProductsAtom,
  monthlyAmountAtom,
  recommendedMonthlyAmountAtom,
  recommendedProductsAtom,
  savingsTermAtom,
  selectedProductAtom,
  targetAmountAtom,
  targetDifferenceAtom,
} from './atoms';

export const useSavingsProduct = () => {
  // 1. API로 products 조회
  const { data: products } = useSavingsProductsQuery();
  const setAllProducts = useSetAtom(allProductsAtom);

  // products를 atom에 동기화
  useEffect(() => {
    if (products) {
      setAllProducts(products);
    }
  }, [products, setAllProducts]);

  // 2. 목표 금액 상태/setter
  const [targetAmount, setTargetAmount] = useAtom(targetAmountAtom);

  // 3. 월 납입액 상태/setter
  const [monthlyAmount, setMonthlyAmount] = useAtom(monthlyAmountAtom);

  // 4. 저축 기간 상태/setter
  const [savingsTerm, setSavingsTerm] = useAtom(savingsTermAtom);

  // 5. 파생 상태 1: 필터된 목록
  const filteredProducts = useAtomValue(filteredProductsAtom);

  // 6. 선택한 product 상태/setter
  const [selectedProduct, setSelectedProduct] = useAtom(selectedProductAtom);

  // 7. 파생 상태 2: 예상 수익 금액
  const expectedRevenue = useAtomValue(expectedRevenueAtom);

  // 8. 파생 상태 3: 목표 금액과의 차이
  const targetDifference = useAtomValue(targetDifferenceAtom);

  // 9. 파생 상태 4: 추천 월 납입 금액
  const recommendedMonthlyAmount = useAtomValue(recommendedMonthlyAmountAtom);

  // 10. 파생 상태 5: 추천 상품 목록
  const recommendedProducts = useAtomValue(recommendedProductsAtom);

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
