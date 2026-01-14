import { http } from 'tosslib';

export type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export const getSavingsProducts = async () => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
};

// export const useSavingsProducts = () => {}
