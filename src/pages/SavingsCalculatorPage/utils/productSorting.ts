import { SavingsProduct } from '../types/types';

export const getTopProductsByRate = (products: SavingsProduct[], count = 2): SavingsProduct[] => {
  return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
};
