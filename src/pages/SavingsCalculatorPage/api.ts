import { http } from 'tosslib';
import { SavingsProduct } from './domain';

export const getSavingsProducts = () => http.get<SavingsProduct[]>('/api/savings-products');
