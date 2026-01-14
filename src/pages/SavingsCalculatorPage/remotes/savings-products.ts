import { http } from 'tosslib';
import { SavingsProduct } from '../models/savings-products.dto';

export const fetchSavingsProducts = async () => {
  // TODO: isHttpError 처리?
  return http.get<SavingsProduct[]>('/api/savings-products');
};
