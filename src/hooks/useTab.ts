import { useState } from 'react';

export function useTab<T extends string>(initialTab: T) {
  const [tab, setTab] = useState<T>(initialTab);

  const handleTabChange = (value: string) => {
    setTab(value as T);
  };

  return [tab, handleTabChange] as const;
}
