import { http } from 'tosslib';
import type { SavingsProduct } from './type';

export const getSavingsProducts = async () => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
};
