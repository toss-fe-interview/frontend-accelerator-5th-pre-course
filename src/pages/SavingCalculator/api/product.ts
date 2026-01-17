import { http } from 'tosslib';

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

export const getSavingsProducts = async () => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
};
