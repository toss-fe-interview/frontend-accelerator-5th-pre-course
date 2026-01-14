import { ErrorBoundary, Suspense } from '@suspensive/react';
import { usePrefetchQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { savingsProductsQueries } from './api/queries';
import CalculationResultTab from './components/CalculationResultTab';
import CalculatorInputSection from './components/CalculatorInputSection';
import ProductListTab from './components/ProductListTab';

const TABS_CONFIG = {
  products: '적금 상품',
  results: '계산 결과',
} as const;

type TabKey = keyof typeof TABS_CONFIG;
const isValidTabKey = (tab: string): tab is TabKey => tab in TABS_CONFIG;

export default function SavingsCalculatorPage() {
  usePrefetchQuery(savingsProductsQueries.listQuery());

  const [currentTab, setCurrentTab] = useState<TabKey>('products');

  const handleTabChange = (tab: string) => {
    if (isValidTabKey(tab)) {
      setCurrentTab(tab);
    }
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <CalculatorInputSection />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        {Object.entries(TABS_CONFIG).map(([tab, label]) => (
          <Tab.Item key={tab} value={tab} selected={currentTab === tab}>
            {label}
          </Tab.Item>
        ))}
      </Tab>

      {currentTab === 'products' && (
        <ErrorBoundary fallback={<div>상품 목록을 불러오는 중 에러가 발생했습니다.</div>}>
          <Suspense fallback={<div>상품 목록을 불러오는 중입니다...</div>}>
            <ProductListTab />
          </Suspense>
        </ErrorBoundary>
      )}
      {currentTab === 'results' && (
        <ErrorBoundary fallback={<div>계산 결과를 불러오는 중 에러가 발생했습니다.</div>}>
          <Suspense fallback={<div>계산 결과를 불러오는 중입니다...</div>}>
            <CalculationResultTab />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
