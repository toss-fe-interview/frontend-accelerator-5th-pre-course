import { useState } from 'react';

type Tab = 'products' | 'results';

export const useTabState = () => {
  const [tab, setTab] = useState<Tab>('products');
  return { tab, setTab };
};

export type { Tab };
