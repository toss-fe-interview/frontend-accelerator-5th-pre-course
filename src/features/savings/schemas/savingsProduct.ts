import z from 'zod';

export const savingsProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  annualRate: z.number(),
  minMonthlyAmount: z.number(),
  maxMonthlyAmount: z.number(),
  availableTerms: z.number(),
});

export type SavingsProduct = z.infer<typeof savingsProductSchema>;
