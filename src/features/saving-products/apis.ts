import { http } from 'tosslib';
import { SavingsProduct } from './types';

export const getSavingsProducts = async () => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
};
