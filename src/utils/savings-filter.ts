import { SavingsProduct } from 'api/savings-products/types';

interface FilterParams {
  monthlyPayment: number;
  availableTerms: number;
  targetAmount: number;
}

// 월 납입액이 상품의 납입 가능 범위 내에 있는지
const isMonthlyPaymentInRange = (monthlyPayment: number, product: SavingsProduct): boolean => {
  return monthlyPayment > product.minMonthlyAmount && monthlyPayment < product.maxMonthlyAmount;
};

// 저축 기간이 상품과 일치하는지
const isTermMatching = (term: number, product: SavingsProduct): boolean => {
  return product.availableTerms === term;
};

// 총 납입액이 목표 금액을 초과할 수 있는지
const canExceedTargetAmount = (monthlyPayment: number, term: number, targetAmount: number): boolean => {
  return monthlyPayment * term > targetAmount;
};

export const filterSavingsProducts = (products: SavingsProduct[], params: FilterParams): SavingsProduct[] => {
  const { monthlyPayment, availableTerms, targetAmount } = params;

  return products.filter(product => {
    const withinMonthlyRange = isMonthlyPaymentInRange(monthlyPayment, product);
    const matchingTerm = isTermMatching(availableTerms, product);
    const achievableTarget = canExceedTargetAmount(monthlyPayment, availableTerms, targetAmount);

    return withinMonthlyRange && matchingTerm && achievableTarget;
  });
};
