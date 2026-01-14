import { z } from 'zod';

export const SavingsProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  annualRate: z.number().positive(),
  minMonthlyAmount: z.number().nonnegative(),
  maxMonthlyAmount: z.number().positive(),
  availableTerms: z.number().positive().int(),
});

export const SavingsProductsSchema = z.array(SavingsProductSchema);

export type SavingsProduct = z.infer<typeof SavingsProductSchema>;
