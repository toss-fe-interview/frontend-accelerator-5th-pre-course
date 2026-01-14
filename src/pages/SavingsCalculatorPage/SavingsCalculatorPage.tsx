import { NavigationBar, Spacing } from 'tosslib';
import { useForm } from 'react-hook-form';
import { SavingsCalculatorContent } from './components/SavingsCalculatorContent';
import { SavingsFilterForm } from './types/saving-filter-form';
import { SavingFilterForm } from './components/SavingFilterForm';

export function SavingsCalculatorPage() {
  const form = useForm<SavingsFilterForm>({
    defaultValues: {
      targetAmount: null,
      monthlyPayment: null,
      term: 12,
    },
  });

  const [targetAmount, monthlyPayment, term] = form.watch(['targetAmount', 'monthlyPayment', 'term']);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingFilterForm control={form.control} />
      <Spacing size={24} />

      <SavingsCalculatorContent targetAmount={targetAmount} monthlyPayment={monthlyPayment} term={term} />
      <Spacing size={40} />
    </>
  );
}
