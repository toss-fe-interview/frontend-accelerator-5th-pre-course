import { z } from 'zod';

export const savingsCalculatorSchema = z.object({
  targetAmount: z.number().min(0),
  monthlyAmount: z.number().min(0),
  availableTerms: z.number().min(0),
});

export type SavingsCalculatorFormData = z.infer<typeof savingsCalculatorSchema>;
