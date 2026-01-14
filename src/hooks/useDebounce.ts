import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, debounceTime: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceTime);
    return () => {
      clearTimeout(timeout);
    };
  }, [debounceTime, value]);

  return debouncedValue;
}
