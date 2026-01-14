import { SavingsProduct } from 'types/savingsProducts';

export const filterSavingsProducts = (products: SavingsProduct[], monthlyAmount: number, term: number) => {
  return products.filter(product => {
    return (
      product.minMonthlyAmount <= monthlyAmount &&
      product.maxMonthlyAmount >= monthlyAmount &&
      product.availableTerms === term
    );
  });
};

// 필터링된 제품 목록을 받아와서 높은 이자율 순으로 정렬한 후 상위 2개 상품을 반환
export const getTop2RecommendedSavingsProducts = (products: SavingsProduct[]) => {
  return products.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
};
