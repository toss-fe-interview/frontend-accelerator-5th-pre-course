import { http } from 'tosslib';
import { SavingsProduct } from './type';

export const savingsApis = {
  getSavingsProducts: () => http.get<SavingsProduct[]>('/api/savings-products'),
};
