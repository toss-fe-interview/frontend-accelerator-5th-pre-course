import { Suspense, useState } from 'react';
import {
  Border,
  NavigationBar,
  Spacing,
  Tab
} from 'tosslib';
import { SavingsCalculationResult } from './components/SavingsCalculationResult';
import { SavingsCalculator } from './components/SavingsCalculator';
import { SavingsProductList } from './components/SavingsProductList';

type SelectedTab = 'products' | 'results';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>('products');

  const handleSelectTab = (tab: string) => {
    setSelectedTab(tab as SelectedTab);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsCalculator />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleSelectTab}>
        <Tab.Item
          value="products"
          selected={selectedTab === "products"}
        >
          적금 상품
        </Tab.Item>
        <Tab.Item
          value="results"
          selected={selectedTab === "results"}
        >
          계산 결과
        </Tab.Item>
      </Tab>

      {(() => {
        switch (selectedTab) {
          case 'products':
            return (
              <Suspense fallback="Loading...">
                <SavingsProductList />
              </Suspense>
            );
          case 'results':
            return <SavingsCalculationResult />;
        }
      })()}
    </>
  );
}
