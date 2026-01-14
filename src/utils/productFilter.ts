import type { SavingsProduct, ProductFilterCriteria } from '../types/savings';

/**
 * 적금 상품 목록을 필터링하는 함수
 * @param products - 전체 상품 목록
 * @param criteria - 필터링 조건
 * @returns 필터링된 상품 목록
 */
export function filterProducts(products: SavingsProduct[], criteria: ProductFilterCriteria): SavingsProduct[] {
  return products.filter(product => {
    // 월 납입액 필터링 (등호 포함)
    if (criteria.monthlyAmount !== undefined && criteria.monthlyAmount > 0) {
      const isMonthlyAmountValid =
        product.minMonthlyAmount <= criteria.monthlyAmount && criteria.monthlyAmount <= product.maxMonthlyAmount;

      if (!isMonthlyAmountValid) {
        return false;
      }
    }

    // 저축 기간 필터링
    if (criteria.savingTerm !== undefined) {
      if (product.availableTerms !== criteria.savingTerm) {
        return false;
      }
    }

    return true;
  });
}
