import { http } from 'tosslib';
import { SavingsProduct } from './types';

export const fetchSavingsProducts = async () => {
  return await http.get<SavingsProduct[]>('/api/savings-products');
};
