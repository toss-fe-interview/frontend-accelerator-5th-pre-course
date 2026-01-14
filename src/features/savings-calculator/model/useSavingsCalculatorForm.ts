import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const savingsCalculatorSchema = z.object({
  // 목표 금액
  targetAmount: z.number().min(0),
  // 월 납입액
  monthlyAmount: z.number().min(0),
  // 저축 기간
  availableTerms: z.number().min(0),
});

export type SavingsCalculatorFormData = z.infer<typeof savingsCalculatorSchema>;

export function useSavingsCalculatorForm() {
  return useForm({
    defaultValues: {
      targetAmount: 1000000,
      monthlyAmount: 50000,
      availableTerms: 12,
    },
    resolver: zodResolver(savingsCalculatorSchema),
  });
}
