import * as httpClient from 'shared/api/httpClient';
import { SavingsProduct } from '../model/types';

export async function getSavingsProducts(): Promise<SavingsProduct[]> {
  return await httpClient.get<SavingsProduct[]>('/savings-products');
}
