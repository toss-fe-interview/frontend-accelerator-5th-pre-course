import { ProductList as ProductListUI } from '../ui/ProductList';
import { useSavingsContext } from '../index';

function ProductListRoot() {
  const { filteredProducts, selectedProductId, setSelectProduct } = useSavingsContext();

  return (
    <ProductListUI
      list={filteredProducts}
      selectedProductId={selectedProductId}
      onProductClick={setSelectProduct}
    />
  );
}

export const ProductList = ProductListRoot
