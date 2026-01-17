import { http, isHttpError } from 'tosslib';
import * as v from 'valibot';
import { type SavingsProduct, SavingsProductSchema } from './schema';

export async function fetchSavingsProducts(): Promise<SavingsProduct[]> {
  try {
    const response = await http.get<unknown[]>('/api/savings-products');
    return parseValidProducts(response);
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
}

const parseValidProducts = (items: unknown[]): SavingsProduct[] => {
  return items.flatMap(item => {
    const result = v.safeParse(SavingsProductSchema, item);
    return result.success ? [result.output] : [];
  });
};
