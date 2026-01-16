import { useState } from 'react';

/**
 * Tab 같은 경우는 한 곳에서 관리하여 오히려 탭 을 수정해야할때 더 직관적이라 생각해서 합체
 */
export const useTab = <T extends readonly string[]>(tabs: T) => {
  type TabValue = T[number];

  if (tabs.length === 0) {
    throw new Error('tabs 배열이 비어있습니다.');
  }

  const [currentTab, setCurrentTab] = useState<TabValue>(tabs[0]);
  const handleTabChange = (value: string) => {
    const valueAsTabValue = value as TabValue;
    const isValueIncluded = tabs.includes(valueAsTabValue);
    if (isValueIncluded) {
      setCurrentTab(valueAsTabValue);
    }
  };

  return {
    currentTab,
    handleTabChange,
  };
};
