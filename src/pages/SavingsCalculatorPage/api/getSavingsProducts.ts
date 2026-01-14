import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from '../types/types';

export async function getSavingsProducts() {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (e) {
    if (isHttpError(e)) {
      console.log(e.message);
    }
  }
}
