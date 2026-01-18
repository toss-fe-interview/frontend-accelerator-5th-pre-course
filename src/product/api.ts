import { http } from 'tosslib';
import { GetSavingsProductsResponse } from './type/remote';

export const getSavingsProducts = async () => {
  const response = await http.get<GetSavingsProductsResponse>('/api/savings-products');
  return response;
};
