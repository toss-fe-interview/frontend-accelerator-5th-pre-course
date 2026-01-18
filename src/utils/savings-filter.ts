import { SavingsProduct } from 'api/savings-products/types';

// 월 납입액이 상품의 납입 가능 범위 내에 있는지
export const isMonthlyPaymentInRange = (monthlyPayment: number | undefined, product: SavingsProduct): boolean => {
  if (!monthlyPayment) {
    return false;
  }

  return monthlyPayment > product.minMonthlyAmount && monthlyPayment < product.maxMonthlyAmount;
};

// 저축 기간이 상품과 일치하는지
export const isTermMatching = (term: number | undefined, product: SavingsProduct): boolean => {
  return product.availableTerms === term;
};
