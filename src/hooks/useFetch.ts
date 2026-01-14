import { useCallback, useEffect, useState } from 'react';

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();

  const doFetch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetcher();

      setData(response);
    } catch (e) {
      console.error(e);
      // error 처리
    }
    setLoading(false);
  }, [fetcher]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, reset: doFetch };
}
