import { useSearchParams } from 'react-router-dom';

export const useTab = ({ key, defaultTab }: { key: string; defaultTab: string }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get(key) ?? defaultTab;
  const changeTab = (tab: string) => {
    setSearchParams({ tab });
  };
  return { currentTab, changeTab };
};
