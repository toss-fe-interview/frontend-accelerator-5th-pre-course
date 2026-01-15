import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getProducts } from 'utils/api';
import SavingCalculator from './SavingCalculator';
import { ProductItem } from 'types/products';

export default function ProductContainer() {
  const { data } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: data => data.map(item => ({ ...item, isSelected: false })),
  });

  const [products, setProducts] = useState<ProductItem[]>([]);

  // 함수 => id를 받아서 product를 찾고 그 아이템의 isSelected값을 true로 변경 나머지는 false

  function handleSelectItem(id: string): void {
    setProducts(prev => {
      return prev.map(item => (item.id === id ? { ...item, isSelected: true } : { ...item, isSelected: false }));
    });
  }

  // 데이터를 클라이언트 동기화 시킨다.
  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  return <SavingCalculator products={products} onProductSelect={handleSelectItem} />;
}
