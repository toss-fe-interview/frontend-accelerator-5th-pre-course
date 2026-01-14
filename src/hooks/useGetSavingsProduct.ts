import { SavingsProduct } from 'model/types';
import { useEffect, useState } from 'react';
import { http, isHttpError } from 'tosslib';

export const useGetSavingsProduct = () => {
  const [savingsProducts, setSavingsProduct] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const getSavingsProduct = async () => {
      try {
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setSavingsProduct(response);
      } catch (e) {
        if (isHttpError(e)) {
          console.log(e.message);
        }
      }
    };
    getSavingsProduct();
  }, []);
  return savingsProducts;
};
