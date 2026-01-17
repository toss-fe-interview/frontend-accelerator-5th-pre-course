import { http } from 'tosslib';
import { SavingsProduct } from '../model/types';

export const savingsProductsApi = async () => {
  return await http.get<SavingsProduct[]>('/api/savings-products');
};
