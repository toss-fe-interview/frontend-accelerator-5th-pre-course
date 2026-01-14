import { useEffect, useState } from 'react';
import { getSavingsProducts } from 'shared/api/fetcher';
import { SavingsProduct } from 'shared/api/type';
import { isHttpError } from 'tosslib';

export const useGetSavingProducts = () => {
  const [savingProducts, setSavingProducts] = useState<SavingsProduct[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const data = await getSavingsProducts();
        setSavingProducts(data || []);
      } catch (error) {
        if (isHttpError(error)) {
          console.error('http 에러', error.message);
        } else {
          console.error('알 수 없는 에러', error);
        }
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { savingProducts, isError, isLoading };
};
