import { SavingsProduct } from '../types/savings';

interface FilterConditions {
  monthlyAmount: number;
  savingPeriod: number;
}

export const filterProducts = (products: SavingsProduct[], conditions: FilterConditions): SavingsProduct[] => {
  const { monthlyAmount, savingPeriod } = conditions;

  // 월 납입액이나 저축 기간이 입력되지 않았으면 전체 상품 반환
  if (!monthlyAmount || !savingPeriod) {
    return products;
  }

  return products.filter(product => {
    // 월 납입액 조건: minMonthlyAmount <= monthlyAmount <= maxMonthlyAmount
    const isMonthlyAmountValid = monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;

    // 저축 기간 조건: availableTerms와 일치
    const isSavingPeriodValid = product.availableTerms === savingPeriod;

    return isMonthlyAmountValid && isSavingPeriodValid;
  });
};
