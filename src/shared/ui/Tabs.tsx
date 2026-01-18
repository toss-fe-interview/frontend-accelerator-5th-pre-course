import { ComponentProps, createContext, PropsWithChildren, ReactNode, useCallback, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tab } from 'tosslib';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a <Tabs />');
  }
  return context;
};

interface TabsProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Tabs({
  children,
  name = 'tab',
  value: controlledValue,
  defaultValue,
  onChange,
}: PropsWithChildren<TabsProps>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : (searchParams.get(name) ?? defaultValue ?? '');

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setSearchParams(
          prev => {
            const next = new URLSearchParams(prev);
            next.set(name, newValue);
            return next;
          },
          { replace: true }
        );
      }
      onChange?.(newValue);
    },
    [isControlled, onChange, setSearchParams, name]
  );

  const contextValue = useMemo(
    () => ({ value: activeValue, onValueChange: handleValueChange }),
    [activeValue, handleValueChange]
  );

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}

interface TabsListProps {
  children: ReactNode;
}

Tabs.List = function TabsList({ children, ...rest }: TabsListProps) {
  const { onValueChange } = useTabsContext();
  return (
    <Tab {...rest} onChange={onValueChange}>
      {children as ComponentProps<typeof Tab>['children']}
    </Tab>
  );
};

interface TabsTabProps {
  value: string;
  children: ReactNode;
}

Tabs.Tab = function TabsTab({ value, children, ...rest }: TabsTabProps) {
  const { value: activeValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <Tab.Item value={value} {...rest} selected={isActive}>
      {children}
    </Tab.Item>
  );
};

interface TabsPanelProps {
  value: string;
  children: ReactNode;
}

Tabs.Panel = function TabsPanel({ value, children }: TabsPanelProps) {
  const { value: activeValue } = useTabsContext();
  const isActive = activeValue === value;

  if (!isActive) {
    return null;
  }

  return <>{children}</>;
};
