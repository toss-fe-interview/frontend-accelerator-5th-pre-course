import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ProductItem } from 'types/products';
import { getProducts } from 'utils/api';

export default function useProducts() {
  const { data } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: data => data.map(item => ({ ...item, isSelected: false })),
  });

  const [products, setProducts] = useState<ProductItem[]>([]);

  function handleSelectItem(id: string): void {
    setProducts(prev => {
      return prev.map(item => (item.id === id ? { ...item, isSelected: true } : { ...item, isSelected: false }));
    });
  }

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  return { products, handleSelectItem };
}
