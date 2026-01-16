import { http, isHttpError } from 'tosslib';
import * as v from 'valibot';
import { type SavingsProduct, SavingsProductSchema } from './schema';

export async function fetchSavingsProducts(): Promise<SavingsProduct[]> {
  try {
    const response = await http.get<unknown[]>('/api/savings-products');

    return response.reduce<SavingsProduct[]>((acc, item) => {
      const result = v.safeParse(SavingsProductSchema, item);
      if (result.success) acc.push(result.output);
      return acc;
    }, []);
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
}
