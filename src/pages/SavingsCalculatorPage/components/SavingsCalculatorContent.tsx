import { useState } from 'react';
import { Tab } from 'tosslib';

type Tab = 'products' | 'results';
function isTab(value: string): value is Tab {
  return value === 'products' || value === 'results';
}

export function SavingsCalculatorContent() {
  const [activeTab, setActiveTab] = useState<Tab>('products');

  return (
    <>
      <Tab
        onChange={value => {
          if (isTab(value)) {
            setActiveTab(value);
          }
        }}
      >
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
    </>
  );
}
