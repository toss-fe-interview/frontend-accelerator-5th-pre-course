import type { SavingsProduct } from 'api/savings-products';

/**
 * 적금 상품을 필터링 하는 함수
 */
export const filterSavingsProducts = (savingsProducts: SavingsProduct[], term: number, monthlyAmount?: number) => {
  return savingsProducts.filter(product => {
    const isTermInvalid = product.availableTerms !== term;
    if (isTermInvalid) {
      return false;
    }

    const isMonthlyAmountUndefined = monthlyAmount === undefined;
    if (isMonthlyAmountUndefined) {
      return true;
    }

    const isMonthlyAmountValid = product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount;
    return isMonthlyAmountValid;
  });
};
