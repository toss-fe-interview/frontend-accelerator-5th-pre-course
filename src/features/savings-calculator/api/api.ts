import { http } from 'tosslib';

type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export async function fetchSavingsProducts() {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
}
