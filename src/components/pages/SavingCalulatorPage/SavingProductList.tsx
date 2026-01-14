import { SavingProduct } from 'queries/types';
import { useSavingProductsQuery } from 'queries/useSavingProductsQuery';
import { useWatch } from 'react-hook-form';
import { isAffordableProducts } from 'utils/savingProductFilter';
import { ProductItem } from './ProductItem';

export const SavingProductList = ({
  selectedProduct,
  setSelectedProduct,
}: {
  selectedProduct: SavingProduct | null;
  setSelectedProduct: (product: SavingProduct) => void;
}) => {
  const { data: savingProducts } = useSavingProductsQuery();
  const { monthlyAmount, term } = useWatch();

  const filteredProducts = savingProducts?.filter(product => isAffordableProducts(product, monthlyAmount, term));

  return (
    <>
      {filteredProducts?.map(savingProduct => (
        <ProductItem
          savingProduct={savingProduct}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      ))}
    </>
  );
};
