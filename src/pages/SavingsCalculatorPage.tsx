import { Border, NavigationBar, Spacing } from 'tosslib';
import { SavingsFilterForm } from 'components/SavingsFilterForm';
import { SavingsTabs } from 'components/SavingsTabs';
import { useSavingsFilterForm } from 'hooks/useSavingsFilterForm';

export function SavingsCalculatorPage() {
  const { savingsFilterForm, handleChanges } = useSavingsFilterForm();

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsFilterForm savingsFilterForm={savingsFilterForm} handleChanges={handleChanges} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsTabs savingsFilterForm={savingsFilterForm} />
    </>
  );
}
