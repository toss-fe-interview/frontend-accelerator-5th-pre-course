import { SavingsProduct } from 'api';
import { useSavingsProductsQuery } from 'hooks/useSavingsProductsQuery';
import { useSelectedProductId } from 'hooks/useSelectedProductId';
import { ProductItem } from './ProductItem';
import { ListRow } from 'tosslib';

export type FilterFn = (product: SavingsProduct) => boolean;
export type OrderByFn = (a: SavingsProduct, b: SavingsProduct) => number;

interface ProductListProps {
  filters?: FilterFn[];
  sortBy?: OrderByFn;
  limit?: number;
}

export function ProductList({ filters, sortBy, limit }: ProductListProps) {
  const { data: products } = useSavingsProductsQuery({ filters, sortBy, limit });
  const [selectedProductId, setSelectedProductId] = useSelectedProductId();

  if (products.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />;
  }

  return (
    <>
      {products.map(product => (
        <ProductItem
          isSelected={selectedProductId === product.id}
          key={product.id}
          product={product}
          onSelect={setSelectedProductId}
        />
      ))}
    </>
  );
}
