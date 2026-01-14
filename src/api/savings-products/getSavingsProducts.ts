import { http } from 'tosslib';
import { SavingsProductsResponse } from './types';

export const getSavingsProducts = async (): Promise<SavingsProductsResponse> => {
  const response = await http.get<SavingsProductsResponse>('/api/savings-products');
  return response;
};
