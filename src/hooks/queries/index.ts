import { useEffect, useState } from 'react';
import { http } from 'tosslib';
import { SavingsProduct } from './types';

export function useSavingsProducts() {
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await http.get<SavingsProduct[]>('/api/savings-products');
        setProducts(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
