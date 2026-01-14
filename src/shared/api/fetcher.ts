import { http, isHttpError } from 'tosslib';
import type { SavingsProduct } from './type';

export const getSavingsProducts = async () => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (e) {
    if (isHttpError(e)) {
      console.error(e.message);
      window.alert('적금 상품을 불러오는 데 실패했습니다.');
    }
  }
};
