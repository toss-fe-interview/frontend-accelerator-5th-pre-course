import { useState } from 'react';
import { Border, Spacing, Tab } from 'tosslib';

interface Tab {
  id: string;
  label: string;
  contents: React.ReactNode;
}

interface TabScreenProps {
  headers: React.ReactNode;
  topContents: React.ReactNode;
  bottomTabs: Tab[];
}

export default function TabScreen({ headers, topContents, bottomTabs }: TabScreenProps) {
  const [selectedTabId, setSelectedTabId] = useState(() => bottomTabs[0].id);

  const handleTabChange = (id: string) => {
    setSelectedTabId(id);
  };

  const selectedTab = bottomTabs.find(tab => tab.id === selectedTabId) ?? bottomTabs[0];

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
          <Tab.Item key={tab.id} value={tab.id} selected={selectedTab.id === tab.id}>
            {tab.label}
          </Tab.Item>
        ))}
      </Tab>

      {selectedTab.contents}
    </>
  );
}
