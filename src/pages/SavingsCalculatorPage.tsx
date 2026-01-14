import { FormProvider, useForm } from 'react-hook-form';
import { Border, NavigationBar, Spacing } from 'tosslib';
import { SavingsCalculatorContent } from 'components/pages/SavingCalulatorPage/SavingsCalculatorContent';
import { SavingsCalculatorInputs } from 'components/pages/SavingCalulatorPage/SavingsCalculatorInputs';

type CalculatorForm = {
  monthlyAmount: number | null;
  targetAmount: number | null;
  term: number;
};

export function SavingsCalculatorPage() {
  const methods = useForm<CalculatorForm>({
    defaultValues: {
      monthlyAmount: null,
      targetAmount: null,
      term: 12,
    },
  });

  return (
    <FormProvider {...methods}>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsCalculatorInputs />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsCalculatorContent />
    </FormProvider>
  );
}
