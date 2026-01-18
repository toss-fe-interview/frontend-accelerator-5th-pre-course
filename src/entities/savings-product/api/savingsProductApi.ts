import { http } from 'tosslib';
import { SavingsProduct } from '../model/types';

export async function getSavingsProducts(): Promise<SavingsProduct[]> {
  return await http.get<SavingsProduct[]>('/api/savings-products');
}
