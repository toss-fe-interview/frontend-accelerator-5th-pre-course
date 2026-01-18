import { Children, ComponentProps, createContext, isValidElement, ReactNode, useContext, useState } from 'react';
import { Tab as TossTab } from 'tosslib';

type TabContextValue = {
  activeTab: string | null;
  onChange: (value: string) => void;
};

const TabContext = createContext<TabContextValue | null>(null);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('Tab 컴포넌트는 Tabs 내부에서 사용되어야 합니다.');
  }
  return context;
};

type TabRootProps = {
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
} & Omit<ComponentProps<typeof TossTab>, 'onChange' | 'children'>;

const separateChildren = (children: ReactNode) => {
  const items: ReactNode[] = [];
  const contents: ReactNode[] = [];

  Children.forEach(children, child => {
    if (isValidElement(child) && child.type === Content) {
      contents.push(child);
    } else {
      items.push(child);
    }
  });

  return { items, contents };
};

const TabRoot = ({ defaultValue, onChange, children, ...props }: TabRootProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(defaultValue ?? null);

  const handleChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  const { items, contents } = separateChildren(children);

  return (
    <TabContext.Provider value={{ activeTab, onChange: handleChange }}>
      <TossTab {...props} onChange={handleChange}>
        {items as ComponentProps<typeof TossTab>['children']}
      </TossTab>
      {contents}
    </TabContext.Provider>
  );
};

type TabItemProps = {
  value: string;
  children: React.ReactNode;
} & Omit<ComponentProps<typeof TossTab.Item>, 'value' | 'selected'>;

const Item = ({ value, children, ...props }: TabItemProps) => {
  const { activeTab } = useTabContext();
  return (
    <TossTab.Item {...props} value={value} selected={activeTab === value}>
      {children}
    </TossTab.Item>
  );
};

type TabContentProps = {
  value: string;
  children: React.ReactNode;
};

const Content = ({ value, children }: TabContentProps) => {
  const { activeTab } = useTabContext();
  return activeTab === value ? <>{children}</> : null;
};

export const Tab = Object.assign(TabRoot, {
  Item,
  Content,
});
