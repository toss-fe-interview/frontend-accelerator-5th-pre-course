import { SavingsProduct } from 'model/types';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { numericFormatter } from 'utils/numericFormatter';

export const useSavingsCalculate = (savingsProducts: SavingsProduct[]) => {
  const [goalAmount, setGoalAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [period, setPeriod] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>, setState: Dispatch<SetStateAction<string>>) => {
    const value = e.target.value;
    const numericValue = numericFormatter(value);
    if (isNaN(numericValue)) {
      return;
    }
    setState(numericValue.toLocaleString());
  };

  const filteredProducts = savingsProducts.filter(product => {
    const numericGoalAmount = numericFormatter(monthlyAmount);

    const monthlyAmountCondition =
      numericGoalAmount > product.minMonthlyAmount && numericGoalAmount < product.maxMonthlyAmount;
    const isSamePeriodAndTerms = period === product.availableTerms;

    return monthlyAmountCondition && isSamePeriodAndTerms;
  });

  const expextedProfit = selectedProduct
    ? Math.round(numericFormatter(monthlyAmount) * period * (1 + (selectedProduct?.annualRate / 100) * 0.5))
    : 0;
  const diffBetweenGoalandExpected = numericFormatter(goalAmount) - expextedProfit;

  const recomendAmountForMonth = selectedProduct
    ? Math.round(numericFormatter(goalAmount) / (period * (1 + (selectedProduct?.annualRate / 100) * 0.5)) / 1000) *
      1000
    : 0;

  const recomendedProduct = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return {
    state: {
      goalAmount,
      monthlyAmount,
      period,
      selectedProduct,
      filteredProducts,
      expextedProfit,
      diffBetweenGoalandExpected,
      recomendAmountForMonth,
      recomendedProduct,
    },
    action: { setGoalAmount, setMonthlyAmount, setPeriod, setSelectedProduct, handleAmountChange },
  };
};
