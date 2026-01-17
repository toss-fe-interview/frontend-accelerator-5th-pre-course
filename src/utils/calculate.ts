import { SavingsProduct } from 'features/savings/model/types';

const roundingNumber = (num: number) => {
  if (num >= 1000) {
    const rounded = Math.round(num / 1000);
    return rounded * 1000;
  }
  return 0;
};

export const calculateExpectedProfit = (monthlyAmount: number, savingTerms: number, annualRate: number) => {
  return monthlyAmount * savingTerms * (1 + annualRate * 0.5);
};

export const calculateRecommendMonthlyPayment = (targetAmount: number, savingTerms: number, annualRate: number) => {
  return roundingNumber(targetAmount) / (savingTerms * (1 + annualRate * 0.5));
};

export const isMonthlyPaymentInRange = (monthlyPayment: number, product: SavingsProduct) => {
  return monthlyPayment <= product.maxMonthlyAmount && monthlyPayment >= product.minMonthlyAmount;
};

export const isSavingsTermsMatching = (savingsTerms: number, product: SavingsProduct) => {
  return savingsTerms && product.availableTerms;
};
