import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from '../model';

export const getSavingsProducts = async () => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(`${error.message}`);
    }
  }
};
