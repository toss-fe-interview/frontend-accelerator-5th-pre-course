import { useSearchParams } from 'react-router-dom';

export const useTab = (defaultValue: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || defaultValue;

  const handleTabChange = (value: string) => {
    setSearchParams(prev => {
      prev.set('tab', value);
      return prev;
    });
  };

  return { tab, handleTabChange };
};
