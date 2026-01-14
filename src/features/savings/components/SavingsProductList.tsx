import { ListRow } from 'tosslib';
import { SavingsProduct } from '../types';
import { SavingsProductItem } from './SavingsProductItem';

type SavingsProductListProps = {
  products?: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
};

export const SavingsProductList = ({ products, selectedProductId, onSelect }: SavingsProductListProps) => {
  if (!products || products.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품이 존재하지 않습니다." />} />;
  }

  return (
    <>
      {products.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          selected={selectedProductId === product.id}
          onSelect={() => onSelect(product.id)}
        />
      ))}
    </>
  );
};
