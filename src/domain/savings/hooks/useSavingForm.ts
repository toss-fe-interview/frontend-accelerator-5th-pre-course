import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from 'domain/savings/schema/form';
import { useForm } from 'react-hook-form';

export const useSavingForm = () => {
  return useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });
};
