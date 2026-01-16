import { useState } from 'react';

type Tab = 'products' | 'results';

export const useTabState = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('products');
  return { selectedTab, setSelectedTab };
};

export type { Tab };
