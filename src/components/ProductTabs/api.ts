import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from './types';

export const fetchSavingsProducts = async (): Promise<SavingsProduct[]> => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (e) {
    if (isHttpError(e)) {
      console.log(e.message);
    }
    throw e;
  }
};
