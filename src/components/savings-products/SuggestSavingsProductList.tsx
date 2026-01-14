import { SavingsProduct } from 'api/savings-products/types';
import { ListHeader, ListRow, Spacing } from 'tosslib';
import { Dispatch } from 'react';
import SavingsProductItem from './SavingsProductItem';

interface SuggestSavingProductsProps {
  filteredProducts: SavingsProduct[];
  selectedProduct: SavingsProduct | null | undefined;
  setSelectedProduct: Dispatch<React.SetStateAction<SavingsProduct | undefined>>;
}

export default function SuggestSavingProductList({
  filteredProducts,
  selectedProduct,
  setSelectedProduct,
}: SuggestSavingProductsProps) {
  if (filteredProducts.length === 0) {
    return (
      <>
        <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
        <Spacing size={12} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품이 존재하지 않습니다." />} />
      </>
    );
  }

  const top2Products = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {top2Products.map(product => (
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
