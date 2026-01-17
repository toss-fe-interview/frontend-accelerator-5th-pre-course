import { SavingsProduct, Term } from 'savingsCalculator/types';

const isMonthlyPaymentInRange = (targetMonthlyPayment: number, minMonthlyAmount: number, maxMonthlyAmount: number) => {
  return minMonthlyAmount < targetMonthlyPayment && maxMonthlyAmount > targetMonthlyPayment;
};

const isTermMatched = (targetTerm: Term, term: Term) => {
  return targetTerm === term;
};

export const 계산_조건에_맞는_적금_상품인지 = ({
  savingsProduct,
  calculationInput,
}: {
  savingsProduct: SavingsProduct;
  calculationInput: { monthlyPayment: number; term: Term };
}) => {
  return (
    isMonthlyPaymentInRange(
      calculationInput.monthlyPayment,
      savingsProduct.minMonthlyAmount,
      savingsProduct.maxMonthlyAmount
    ) && isTermMatched(calculationInput.term, savingsProduct.availableTerms)
  );
};
