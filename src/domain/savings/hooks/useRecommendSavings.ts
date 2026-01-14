import { SavingsResponse } from 'domain/savings/api/type';

export const useRecommendSavings = () => {
  const getRecommendSavings = (savings: SavingsResponse[]) => {
    return [...savings].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  };

  return { getRecommendSavings: getRecommendSavings };
};
