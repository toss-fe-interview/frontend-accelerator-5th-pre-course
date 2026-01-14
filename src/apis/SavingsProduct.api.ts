import { http } from 'tosslib';
import { SavingsProduct } from 'types/SavingsProduct.type';

// GET /api/savings-products
export const getSavingsProducts = () => http.get<SavingsProduct[]>('/api/savings-products');
