import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getProducts, ProductResponseDto } from 'utils/api';

// TODO: 타입 위치 옮겨야함.
export type ProductItem = ProductResponseDto & { isSelected: boolean };

export default function ProductContainer() {
  // useQuery로 데이터를 불러온다. => isSelected 추가

  const { data } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: data => data.map(item => ({ ...item, isSelected: false })),
  });

  const [products, setProducts] = useState<ProductItem[]>();

  // 함수 => id를 받아서 product를 찾고 그 아이템의 isSelected값을 true로 변경 나머지는 false

  function toggleItem(id: string): void {
    return [];
  }

  // 데이터를 클라이언트 동기화 시킨다.
  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);
  // 데이터랑 함수를 prop로 Calculator.tsx로 넘긴다.
  return <div></div>;
}
