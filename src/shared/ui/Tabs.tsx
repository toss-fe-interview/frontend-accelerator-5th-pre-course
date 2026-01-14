import { createContext, useContext, useState, type ReactNode } from 'react';
import { Tab } from 'tosslib';

type TabItem<T extends string> = {
  value: T;
  label: ReactNode;
};

type TabsContextType<T extends string> = {
  value: T;
  setValue: (value: T) => void;
  items: TabItem<T>[];
};

const TabsContext = createContext<TabsContextType<string> | null>(null);

function useTabsContext<T extends string>() {
  const context = useContext(TabsContext) as TabsContextType<T> | null;
  if (!context) {
    throw new Error('Tabs 컴포넌트 내부에서 사용해주세요.');
  }
  return context;
}

type TabsProps<T extends string> = {
  defaultValue: NoInfer<T>;
  items: TabItem<T>[];
  children: ReactNode;
};

export function Tabs<T extends string>({ defaultValue, items, children }: TabsProps<T>) {
  const [value, setValue] = useState<T>(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue: setValue as (value: string) => void, items }}>
      {children}
    </TabsContext.Provider>
  );
}

function List() {
  const { value, setValue, items } = useTabsContext();

  return (
    <Tab onChange={setValue}>
      {items.map(item => (
        <Tab.Item key={item.value} value={item.value} selected={value === item.value}>
          {item.label}
        </Tab.Item>
      ))}
    </Tab>
  );
}

type ContentProps<T extends string> = {
  value: T;
  children: ReactNode;
};

function Content<T extends string>({ value, children }: ContentProps<T>) {
  const { value: selectedValue } = useTabsContext<T>();
  return selectedValue === value ? <>{children}</> : null;
}

Tabs.List = List;
Tabs.Content = Content;
