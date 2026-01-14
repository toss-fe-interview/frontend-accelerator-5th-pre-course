import { useEffect, useState } from 'react';
import { getSavingsProducts } from 'shared/api/fetcher';
import { SavingsProduct } from 'shared/api/type';

export const useGetSavingProducts = () => {
  const [savingProducts, setSavingProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSavingsProducts();
      setSavingProducts(data || []);
    };
    fetchData();
  }, []);

  return { savingProducts };
};
