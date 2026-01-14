import { SavingsProduct } from 'api/savings-products/types';
import { Dispatch } from 'react';
import SavingsProductItem from './SavingsProductItem';

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
  const handleSavingsProductItemClick = (clickedProduct: SavingsProduct) => {
    setSelectedProduct(clickedProduct);
  };

  return (
    <>
      {products.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          selectedProductId={selectedProduct && selectedProduct.id}
          onClick={() => handleSavingsProductItemClick(product)}
        />
      ))}
    </>
  );
}
