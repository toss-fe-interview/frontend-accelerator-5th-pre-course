import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import SavingCalculatorInput from './components/SavingCalculatorInput';
import SavingItemList from './components/SavingItemList';
import SavingResult from './components/SavingResult';

export function SavingsCalculatorPage() {
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <SavingCalculatorInput />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={() => {}}>
        <Tab.Item value="products" selected={true}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={false}>
          계산 결과
        </Tab.Item>
      </Tab>
      <SavingItemList />
      <SavingResult />
    </>
  );
}
