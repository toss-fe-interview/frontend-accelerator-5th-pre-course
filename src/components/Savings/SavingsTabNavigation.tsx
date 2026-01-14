import { SavingsTabValue, SavingTabListType } from 'pages/SavingsCalculatorPage';
import { Tab } from 'tosslib';
import { useSavingsContext } from './index';

interface SavingsTabNavigationProps {
  tabs: SavingTabListType;
}

export function SavingsTabNavigation({ tabs }: SavingsTabNavigationProps) {
  const { selectedTab, setSelectedTab } = useSavingsContext();

  return (
    <Tab onChange={(v) => setSelectedTab(v as SavingsTabValue)}>
      {tabs.map((tab) => (
        <Tab.Item key={tab.value} value={tab.value} selected={selectedTab === tab.value}>
          {tab.name}
        </Tab.Item>
      ))}
    </Tab>
  );
}
