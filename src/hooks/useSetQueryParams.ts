import { useSearchParams } from 'react-router-dom';

export const useSetQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setQueryParams = (key: string, value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set(key, value);
      return newParams;
    });
  };

  return { searchParams, setQueryParams };
};
