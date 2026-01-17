import { Children, createContext, isValidElement, ReactElement, ReactNode, useContext } from 'react';

type TabContentContextValue = {
  selectedTab: string;
};

const TabContentContext = createContext<TabContentContextValue | null>(null);

type TabContentProps = {
  selectedTab: string;
  children: ReactNode;
};

type TabPanelProps = {
  value: string;
  children: ReactNode;
};

function TabContent({ selectedTab, children }: TabContentProps) {
  return <TabContentContext.Provider value={{ selectedTab }}>{children}</TabContentContext.Provider>;
}

function TabPanel({ value, children }: TabPanelProps) {
  const context = useContext(TabContentContext);

  if (!context) {
    throw new Error('TabPanel must be used within TabContent');
  }

  if (context.selectedTab !== value) {
    return null;
  }

  return <>{children}</>;
}

TabContent.Panel = TabPanel;

export default TabContent;
