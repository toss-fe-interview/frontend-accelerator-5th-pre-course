import { SavingsProduct } from "types/savings";

export const getTopProductsByAnnualRate = (products: SavingsProduct[], count = 2): SavingsProduct[] => {
  return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
};
