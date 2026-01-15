import type { SavingsProduct } from 'domains/Savings/types';
import { http } from 'tosslib';

export async function fetchProducts(): Promise<SavingsProduct[]> {
  return await http.get<SavingsProduct[]>('/api/savings-products');
}
