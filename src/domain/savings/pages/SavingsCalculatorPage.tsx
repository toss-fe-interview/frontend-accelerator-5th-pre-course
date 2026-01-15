import { Border, NavigationBar, Spacing } from 'tosslib';
import { SavingsFilterForm } from 'domain/savings/components/SavingsFilterForm';
import { SavingsTabs } from 'domain/savings/components/SavingsTabs';
import { useSavingsForm } from '@savings/hooks/useSavingsForm';

function SavingsCalculatorPage() {
  const { savingsForm, handleChanges } = useSavingsForm();

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <SavingsFilterForm savingsForm={savingsForm} handleChanges={handleChanges} />
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <SavingsTabs savingsForm={savingsForm} />
    </>
  );
}

export default SavingsCalculatorPage;
