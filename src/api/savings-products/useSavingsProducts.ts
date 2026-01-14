import { useState, useEffect } from 'react';
import { SavingsProduct } from './types';
import { getSavingsProducts } from './getSavingsProducts';
import { isHttpError } from 'tosslib';

export const useSavingsProducts = () => {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchSavingsProducts = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await getSavingsProducts();
        if (!isCancelled) {
          setSavingsProducts(response);
        }
      } catch (error) {
        if (!isCancelled) {
          setIsError(true);
          if (isHttpError(error)) {
            console.error('http 에러', error.message);
          } else {
            console.error('알 수 없는 에러', error);
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchSavingsProducts();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { savingsProducts, isError, isLoading };
};
