import { SavingsProduct } from 'shared/api/type';

export const createSavingsFilter = ({ 월납입액, 저축기간 }: { 월납입액: number; 저축기간: number }) => {
  return (product: SavingsProduct): boolean => {
    return (
      product.minMonthlyAmount <= 월납입액 &&
      product.maxMonthlyAmount >= 월납입액 &&
      product.availableTerms === 저축기간
    );
  };
};

export const sortByDesc = (products: SavingsProduct[]) => products.toSorted((a, b) => b.annualRate - a.annualRate);
export const takeTop2 = (products: SavingsProduct[]) => products.slice(0, 2);
