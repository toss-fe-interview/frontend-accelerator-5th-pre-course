import { http } from 'tosslib';
import { GetSavingsProductsResponse } from './type/remote';

export const getSavingsProducts = async () => {
  try {
    const response = await http.get<GetSavingsProductsResponse>('/api/savings-products');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
