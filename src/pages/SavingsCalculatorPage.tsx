import { SavingsFilter } from 'components/SavingsCalculator/SavingsFilter';
import { SavingsTab } from 'components/SavingsCalculator/SavingsTab';
import { Border, NavigationBar, Spacing } from 'tosslib';

export function SavingsCalculatorPage() {
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsFilter />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsTab />
    </>
  );
}
