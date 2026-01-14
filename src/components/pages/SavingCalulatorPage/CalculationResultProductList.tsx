import { SavingProduct } from 'queries/types';
import { useWatch } from 'react-hook-form';
import { ProductItem } from './ProductItem';
import { isAffordableProducts } from 'utils/savingProductFilter';
import { useSavingProductsQuery } from 'queries/useSavingProductsQuery';

export const CalculationResultProductList = ({
  selectedProduct,
  setSelectedProduct,
}: {
  selectedProduct: SavingProduct | null;
  setSelectedProduct: (product: SavingProduct) => void;
}) => {
  const { data: savingProducts } = useSavingProductsQuery();

  const { monthlyAmount, term } = useWatch();
  const recommendProductList = savingProducts
    ?.filter(product => isAffordableProducts(product, monthlyAmount, term))
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return (
    <>
      {recommendProductList?.map(product => (
        <ProductItem
          savingProduct={product}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      ))}
    </>
  );
};
