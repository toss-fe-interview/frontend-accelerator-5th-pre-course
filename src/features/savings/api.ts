import { SavingsProduct } from 'model/types';
import { http } from 'tosslib';

export const getSavingsProducts = async () => {
  return await http.get<SavingsProduct[]>('/api/savings-products');
};
