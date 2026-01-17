import { http } from 'tosslib';

export type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export const fetchSavingsProducts = () => {
  return http.get<SavingsProduct[]>('/api/savings-products');
};
