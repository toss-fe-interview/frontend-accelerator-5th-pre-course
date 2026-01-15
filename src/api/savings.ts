import { http } from 'tosslib';
import { SavingsProduct } from 'types/savings';

export const getSavingsProducts = async (): Promise<SavingsProduct[]> => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
