import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from '../types/savingsProduct';

export const fetchSavingsProducts = async (): Promise<SavingsProduct[]> => {
  try {
    return await http.get<SavingsProduct[]>('/api/savings-products');
  } catch (e) {
    if (isHttpError(e)) {
      throw new Error(`적금 상품 조회 실패: ${e.message}`);
    }

    throw e;
  }
};
