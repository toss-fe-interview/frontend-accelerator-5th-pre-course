import { SavingsProductType } from 'shared/types/api/savings';

interface RangeInProps {
  min: number;
  max: number;
}

export const rangeIn = (value: number, { min, max }: RangeInProps) => {
  return value >= min && value <= max;
};

export const sortByAnnualRateDesc = (a: SavingsProductType, b: SavingsProductType) => {
  return b.annualRate - a.annualRate;
};

export const getRecommendedProducts = (products: SavingsProductType[]) => {
  return products.sort(sortByAnnualRateDesc).slice(0, 2);
};
