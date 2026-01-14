import z from 'zod';

export const formSchema = z.object({
  goalAmount: z.number().optional(),
  monthlyAmount: z.number().optional(),
  terms: z.number(),
});

export type FormSchema = z.infer<typeof formSchema>;
