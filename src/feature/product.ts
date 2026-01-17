import { CalculatorForm } from 'types/calculate';
import { ProductItem } from 'types/products';

export function getFilterProductsByInputValue(products: ProductItem[], userInput: CalculatorForm) {
  if (products.length === 0) {
    return [];
  }

  return products
    .filter(product => product.minMonthlyAmount < Number(userInput.monthlyPayment))
    .filter(product => product.maxMonthlyAmount > Number(userInput.monthlyPayment))
    .filter(product => product.availableTerms === userInput.savingPeriod);
}

export type CalculationType = 'ExpectedReturnAmount' | 'TargetGapAmount' | 'RecommendedMonthlyContribution';

export function createSavingCalculator(userInput: CalculatorForm, selectedProduct?: ProductItem) {
  if (!selectedProduct) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      calculate(_type: CalculationType): number {
        return 0;
      },
    };
  }

  const calculations: Record<CalculationType, () => number> = {
    // 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
    ExpectedReturnAmount: () =>
      Number(userInput.monthlyPayment) * userInput.savingPeriod * (1 + selectedProduct.annualRate * 0.5),
    // 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
    TargetGapAmount: () => Number(userInput.targetAmount) - calculations.ExpectedReturnAmount(),
    // 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
    RecommendedMonthlyContribution: () =>
      Number(userInput.targetAmount) / (userInput.savingPeriod * (1 + selectedProduct.annualRate * 0.5)),
  };

  return {
    calculate(type: CalculationType): number {
      return calculations[type]();
    },
  };
}
