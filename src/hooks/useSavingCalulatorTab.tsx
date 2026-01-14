import { useState } from 'react';

export const TAB_STATE = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabType = (typeof TAB_STATE)[keyof typeof TAB_STATE];

export const isTabType = (value: string): value is TabType => {
  return Object.values(TAB_STATE).includes(value as TabType);
};

export const useSavingCalulatorTab = () => {
  const [tabState, setTabState] = useState<TabType>(TAB_STATE.PRODUCTS);

  return [tabState, setTabState] as const;
};
