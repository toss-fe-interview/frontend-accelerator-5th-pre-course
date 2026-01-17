import { useSavingsProducts } from '../hooks/useSavingsProducts';
import { SavingsProduct } from '../types/types';
import { SavingsProductItem } from './SavingsProductItem';

export const SavingResultList = ({
  filterLogic,
  selectedSavingsProduct,
  handleSelectedSavingsProduct,
}: {
  filterLogic: (products: SavingsProduct[]) => SavingsProduct[];
  selectedSavingsProduct: SavingsProduct | null;
  handleSelectedSavingsProduct: (product: SavingsProduct | null) => void;
}) => {
  const { data: savingsProducts = [] } = useSavingsProducts();

  return (
    <>
      {filterLogic(savingsProducts).map(product => {
        const isSelected = selectedSavingsProduct?.id === product.id;
        return (
          <SavingsProductItem
            key={product.id}
            product={product}
            onClick={() => {
              handleSelectedSavingsProduct(isSelected ? null : product);
            }}
            isSelected={isSelected}
          />
        );
      })}
    </>
  );
};
