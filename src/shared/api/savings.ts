import { http } from 'tosslib';
import type { SavingsProductType } from 'shared/types/api/savings';

const SavingsApi = {
  getSavingsProducts: async () => {
    const response = await http.get<SavingsProductType[]>('http://localhost:5173/api/savings-products');
    return response;
  },
};

export default SavingsApi;
