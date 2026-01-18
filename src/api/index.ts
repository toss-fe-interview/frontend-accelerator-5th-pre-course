import { http } from 'tosslib';

export type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export async function getSavingsProducts(): Promise<SavingsProduct[]> {
  return http.get<SavingsProduct[]>('/api/savings-products');
}
