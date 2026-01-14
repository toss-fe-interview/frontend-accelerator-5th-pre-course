import { useEffect, useState } from 'react';
import { getSavingsProducts } from '../api/getSavingsProducts';
import { SavingsProduct } from '../types/types';

export function useSavingsProducts() {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      // TODO: 에러, 로딩 처리
      const response = await getSavingsProducts();
      if (response) {
        setSavingsProducts(response);
      }
    };

    fetchSavingsProducts();
  }, []);

  return savingsProducts;
}
