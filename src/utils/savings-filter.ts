import type { SavingsProduct } from 'api/savings-products';

/**
 * 적금 상품을 필터링 하는 함수
 */
export const filterSavingsProducts = (savingsProducts: SavingsProduct[], term: number, monthlyAmount?: number) => {
  return savingsProducts.filter(product => {
    if (product.availableTerms !== term) {
      return false;
    }

    if (monthlyAmount === undefined) {
      return true;
    }

    const isMonthlyAmountValid = product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount;
    return isMonthlyAmountValid;
  });
};
