import { useState } from 'react';
import { Tab } from 'tosslib';

interface NavigationTabItem {
  value: string;
  label: string;
  renderContent: () => React.ReactNode;
}
export const NavigationTab = ({ tabs }: { tabs: NavigationTabItem[] }) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].value);

  if (tabs.length === 0) {
    return null;
  }
  return (
    <div>
      <Tab onChange={value => setSelectedTab(value)}>
        {tabs.map(tab => (
          <Tab.Item key={tab.value} value={tab.value} selected={selectedTab === tab.value}>
            {tab.label}
          </Tab.Item>
        ))}
      </Tab>
      {tabs.find(tab => tab.value === selectedTab)?.renderContent() ?? null}
    </div>
  );
};
