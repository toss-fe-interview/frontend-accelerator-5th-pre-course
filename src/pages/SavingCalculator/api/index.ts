import { useSuspenseQuery } from '@tanstack/react-query';
import { http } from 'tosslib';

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export const useGetSavingsProducts = () => {
  return useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
  });
};
