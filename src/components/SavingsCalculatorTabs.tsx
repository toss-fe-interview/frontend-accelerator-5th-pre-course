import { useTab } from 'hooks/useTab';
import { Tab } from 'tosslib';

type SavingsCalculatorTabsProps = {
  renderContent: (tab: 'products' | 'results') => React.ReactNode;
};

export function SavingsCalculatorTabs({ renderContent }: SavingsCalculatorTabsProps) {
  const [tab, handleTabChange] = useTab<'products' | 'results'>('products');
  return (
    <>
      <Tab onChange={handleTabChange}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {renderContent(tab)}
    </>
  );
}
