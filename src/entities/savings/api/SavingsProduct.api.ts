import { http } from 'tosslib';

import { SavingsProduct } from 'entities/savings/model/types';

// GET /api/savings-products
export const getSavingsProducts = () => http.get<SavingsProduct[]>('/api/savings-products');
