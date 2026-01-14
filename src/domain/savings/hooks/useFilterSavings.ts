import { SavingsResponse } from 'domain/savings/api/type';

interface Params {
  savings: SavingsResponse[];
  monthlyAmount: number;
  terms: number;
}

export const useFilterSavings = ({ savings, monthlyAmount, terms }: Params) => {
  const filterMinMonthlyAmount = (savings: SavingsResponse[]) => {
    return savings.filter(saving => saving.minMonthlyAmount < monthlyAmount);
  };
  const filterMaxMonthlyAmount = (savings: SavingsResponse[]) => {
    return savings.filter(saving => saving.maxMonthlyAmount > monthlyAmount);
  };
  const filterAvailableTerms = (savings: SavingsResponse[]) => {
    return savings.filter(saving => saving.availableTerms >= terms);
  };

  const filterSavings = () => {
    return filterMinMonthlyAmount(filterMaxMonthlyAmount(filterAvailableTerms(savings)));
  };

  return { filteredSavings: filterSavings() };
};
