import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import SavingCalculatorInput from './components/SavingCalculatorInput';
import SavingItemList from './components/SavingItemList';
import SavingResult from './components/SavingResult';
import { Suspense, useState } from 'react';

type SelectedTab = 'products' | 'results';

function SavingsCalculator() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>('products');
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <SavingCalculatorInput />
      <Border height={16} />
      <Spacing size={8} />
      <Tab onChange={value => setSelectedTab(value as SelectedTab)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {selectedTab === 'products' && <SavingItemList />}
      {selectedTab === 'results' && <SavingResult />}
      <SavingResult />
    </>
  );
}

function SavingsCalculatorLoading() {
  return (
    <div>
      <p>적금 목록 불러오는중입니다...</p>
    </div>
  );
}

export function SavingsCalculatorPage() {
  return (
    <Suspense fallback={<SavingsCalculatorLoading />}>
      <SavingsCalculator />
    </Suspense>
  );
}
