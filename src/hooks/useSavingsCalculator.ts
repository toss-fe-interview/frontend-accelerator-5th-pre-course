import { useMemo } from 'react';
import { SavingsFormData, SavingsProduct } from 'types/savings';
import { calculateSavingsResult } from 'utils/calculateSavings';
import { filterProducts } from 'utils/filterProducts';
import { parseFormattedNumber } from 'utils/numberUtils';

interface UseSavingsCalculatorParams {
  products: SavingsProduct[] | undefined;
  formData: SavingsFormData;
  selectedProductId: string | null;
}

export const useSavingsCalculator = ({ products, formData, selectedProductId }: UseSavingsCalculatorParams) => {
  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    if (formData.monthlyAmount === '') {
      return products;
    }

    return filterProducts(products, {
      monthlyAmount: parseFormattedNumber(formData.monthlyAmount),
      savingPeriod: formData.savingPeriod,
    });
  }, [products, formData.monthlyAmount, formData.savingPeriod]);

  const recommendedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [filteredProducts]);

  const selectedProduct = useMemo(() => {
    if (!products || !selectedProductId) {
      return null;
    }
    return products.find(p => p.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  const calculationResult = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }

    const targetAmount = parseFormattedNumber(formData.targetAmount);
    const monthlyAmount = parseFormattedNumber(formData.monthlyAmount);

    if (!targetAmount || !monthlyAmount) {
      return null;
    }

    return calculateSavingsResult({
      monthlyAmount,
      savingPeriod: formData.savingPeriod,
      annualRate: selectedProduct.annualRate,
      targetAmount,
    });
  }, [selectedProduct, formData]);

  return {
    filteredProducts,
    recommendedProducts,
    selectedProduct,
    calculationResult,
  };
};
