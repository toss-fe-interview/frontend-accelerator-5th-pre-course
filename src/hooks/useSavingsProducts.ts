import { useEffect, useState } from 'react';
import { http, isHttpError } from 'tosslib';
import type { SavingsProduct } from '../types/savings';

interface UseSavingsProductsResult {
  products: SavingsProduct[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 적금 상품 목록을 가져오는 커스텀 훅
 * @returns 상품 목록, 로딩 상태, 에러 메시지
 */
export function useSavingsProducts(): UseSavingsProductsResult {
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setProducts(response);
      } catch (e) {
        if (isHttpError(e)) {
          setError(e.message);
        } else {
          setError('적금 상품을 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
