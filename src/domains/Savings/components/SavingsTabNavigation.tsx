import { SavingsTabValue, SavingTabListType } from 'pages/SavingsCalculatorPage';
import { Tab } from 'tosslib';

interface SavingsTabNavigationProps {
  tabs: SavingTabListType;
  selectedTab: SavingsTabValue;
  onTabChange: (tab: SavingsTabValue) => void;
}

export function SavingsTabNavigation({ tabs, selectedTab, onTabChange }: SavingsTabNavigationProps) {
  return (
    <Tab onChange={(v) => onTabChange(v as SavingsTabValue)}>
      {tabs.map((tab) => (
        <Tab.Item key={tab.value} value={tab.value} selected={selectedTab === tab.value}>
          {tab.name}
        </Tab.Item>
      ))}
    </Tab>
  );
}
