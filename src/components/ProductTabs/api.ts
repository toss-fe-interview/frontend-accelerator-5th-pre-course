import { http } from 'tosslib';
import { SavingsProduct } from './types';

export const fetchSavingsProducts = async (): Promise<SavingsProduct[]> => {
  return await http.get<SavingsProduct[]>('/api/savings-products');
};
