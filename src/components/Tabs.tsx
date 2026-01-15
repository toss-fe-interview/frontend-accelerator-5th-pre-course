import { ComponentProps, createContext, useContext, useState } from 'react';
import { Tab } from 'tosslib';

export const TAB_STATE = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabType = (typeof TAB_STATE)[keyof typeof TAB_STATE];

const isTabType = (value: string): value is TabType => {
  return Object.values(TAB_STATE).includes(value as TabType);
};

const TabContext = createContext<TabType>(TAB_STATE.PRODUCTS);

export const Tabs = ({
  trigger,
  children,
}: {
  trigger: ComponentProps<typeof Tab>['children'];
  children: React.ReactNode;
}) => {
  const [tabState, setTabState] = useState<TabType>(TAB_STATE.PRODUCTS);

  const handleChange = (value: string) => {
    if (isTabType(value)) {
      setTabState(value);
    }
  };

  return (
    <TabContext.Provider value={tabState}>
      <Tab onChange={handleChange}>{trigger}</Tab>
      {children}
    </TabContext.Provider>
  );
};

const Item = ({
  value,
  children,
  ...props
}: Omit<ComponentProps<typeof Tab.Item>, 'selected' | 'value'> & { value: TabType }) => {
  const tabState = useContext(TabContext);
  return (
    <Tab.Item {...props} value={value} selected={tabState === value}>
      {children}
    </Tab.Item>
  );
};

const Panel = ({ value, children }: { value: TabType; children: React.ReactNode }) => {
  const tabState = useContext(TabContext);

  return tabState === value ? children : null;
};

Tabs.Item = Item;
Tabs.Panel = Panel;
