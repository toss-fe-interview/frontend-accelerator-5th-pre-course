import { useMemo } from 'react';
import type { SavingsProduct } from 'shared/types';

const SIMPLE_INTEREST_COEFFICIENT = 0.5;
const ROUNDING_UNIT = 1000;
const RECOMMENDED_PRODUCTS_COUNT = 2;

interface UseSavingsCalculatorParams {
  products: SavingsProduct[];
  goalAmount: number | null;
  monthlyAmount: number | null;
  term: number;
  selectedProductId: string | null;
}

export function useSavingsCalculator({
  products,
  goalAmount,
  monthlyAmount,
  term,
  selectedProductId,
}: UseSavingsCalculatorParams) {
  const filteredProducts = useMemo(() => {
    if (monthlyAmount === null) {
      return products;
    }

    return products.filter(
      product =>
        product.minMonthlyAmount < monthlyAmount &&
        monthlyAmount < product.maxMonthlyAmount &&
        product.availableTerms === term
    );
  }, [products, monthlyAmount, term]);

  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

  const recommendedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, RECOMMENDED_PRODUCTS_COUNT);
  }, [filteredProducts]);

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

  return {
    filteredProducts,
    selectedProduct,
    recommendedProducts,
    calculationResult,
  };
}
