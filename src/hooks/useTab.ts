import { useSearchParams } from 'react-router-dom';

export const useTab = ({ key, defaultTab }: { key: string; defaultTab: string }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get(key) ?? defaultTab;
  const changeTab = (tab: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set(key, tab);
      return newParams;
    });
  };
  return { currentTab, changeTab };
};
