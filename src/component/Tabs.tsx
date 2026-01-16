import { Tab } from 'tosslib';
import { TabValue } from 'types/calculator';

interface TabsProps {
  selectedTab: TabValue;
  setSelectedTab: (tab: TabValue) => void;
}

const Tabs = ({ selectedTab, setSelectedTab }: TabsProps) => {
  return (
    <Tab onChange={value => setSelectedTab(value as TabValue)}>
      <Tab.Item value="products" selected={selectedTab === 'products'}>
        적금 상품
      </Tab.Item>
      <Tab.Item value="results" selected={selectedTab === 'results'}>
        계산 결과
      </Tab.Item>
    </Tab>
  );
};

export default Tabs;
