import { useState } from 'react';
import { Border, Spacing, Tab } from 'tosslib';

interface Tab {
  value: string;
  label: string;
  contents: React.ReactNode;
}

interface TabScreenProps {
  headers: React.ReactNode;
  topContents: React.ReactNode;
  bottomTabs: Tab[];
}

export default function TabScreen({ headers, topContents, bottomTabs }: TabScreenProps) {
  const [selectedTabValue, setSelectedTabValue] = useState(() => bottomTabs[0].value);

  const handleTabChange = (value: string) => {
    setSelectedTabValue(value);
  };

  const selectedTab = bottomTabs.find(tab => tab.value === selectedTabValue) ?? bottomTabs[0];

  return (
    <>
      {headers}
      <Spacing size={16} />
      {topContents}

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        {bottomTabs.map(tab => (
          <Tab.Item key={tab.value} value={tab.value} selected={selectedTab.value === tab.value}>
            {tab.label}
          </Tab.Item>
        ))}
      </Tab>

      {selectedTab.contents}
    </>
  );
}
