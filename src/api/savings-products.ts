import { useEffect, useState } from 'react';
import { http, isHttpError } from 'tosslib';

export type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export const getSavingsProducts = async () => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');
  return response;
};

export const useSavingsProducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getSavingsProducts()
      .then(response => {
        setSavingsProducts(response);
        setError(null);
      })
      .catch(e => {
        if (isHttpError(e)) {
          console.log(e.message);
          // setError(e);
        }
        setError(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    savingsProducts,
    isLoading,
    error,
    isError: Boolean(error),
  };
};
