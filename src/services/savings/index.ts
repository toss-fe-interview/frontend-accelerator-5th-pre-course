import { http } from 'tosslib';
import { z } from 'zod';

const savingsProductScheme = z.object({
  id: z.string(),
  name: z.string(),
  annualRate: z.number(),
  minMonthlyAmount: z.number(),
  maxMonthlyAmount: z.number(),
  availableTerms: z.number(),
});
export type SavingsProductItem = z.infer<typeof savingsProductScheme>;

export const getSavingsProduct = async () => {
  const response = await http.get<SavingsProductItem[]>('/api/savings-products');
  return z.array(savingsProductScheme).parse(response);
};
