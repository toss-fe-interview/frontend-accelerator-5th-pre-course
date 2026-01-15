import { useState } from 'react';

/**
 * Tab 같은 경우는 한 곳에서 관리하여 오히려 탭 을 수정해야할때 더 직관적이라 생각해서 합체
 */
const TAB = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabType = (typeof TAB)[keyof typeof TAB];

export const useTab = () => {
  const [currentTab, setCurrentTab] = useState<TabType>(TAB.PRODUCTS);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as TabType);
  };

  return {
    currentTab,
    handleTabChange,
    TAB,
  };
};
