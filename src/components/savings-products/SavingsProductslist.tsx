import { SavingsProduct } from 'api/savings-products/types';
import { Dispatch } from 'react';
import SavingsProductItem from './SavingsProductItem';
import { ListRow, Spacing } from 'tosslib';

interface SavingsProductsListProps {
  products: SavingsProduct[];
  selectedProduct: SavingsProduct | null | undefined;
  setSelectedProduct: Dispatch<React.SetStateAction<SavingsProduct | undefined>>;
}

export default function SavingsProductsList({
  products,
  selectedProduct,
  setSelectedProduct,
}: SavingsProductsListProps) {
  if (products.length === 0) {
    return (
      <>
        <Spacing size={10} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품이 존재하지 않습니다." />} />
      </>
    );
  }

  return (
    <>
      {products.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          selectedProductId={selectedProduct && selectedProduct.id}
          onClick={() => setSelectedProduct(product)}
        />
      ))}
    </>
  );
}
