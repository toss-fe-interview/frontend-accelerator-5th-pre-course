import { http, isHttpError } from 'tosslib';

type ProductResponseDto = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

// GET /api/savings-products
export async function getProducts() {
  return await http.get<ProductResponseDto[]>('/api/savings-products');
}
