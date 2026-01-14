import { EmptyListItem } from 'components/common/EmptyListItem';
import { SavingsProductListItem } from 'components/SavingsProductListItem';
import { SavingsProduct } from 'types/SavingsProduct.type';

interface SavingsProductListProps {
  savingsProducts: SavingsProduct[];
  selectedSavingsProductId: string | null;
  handleSelectProduct: (savingsProduct: SavingsProduct | null) => void;
  emptyText: string;
}

export function SavingsProductList({
  savingsProducts,
  selectedSavingsProductId,
  handleSelectProduct,
  emptyText,
}: SavingsProductListProps) {
  if (savingsProducts.length <= 0) {
    return <EmptyListItem message={emptyText} />;
  }
  return (
    <>
      {savingsProducts.map(savingsProduct => {
        const isSelected = selectedSavingsProductId === savingsProduct.id;
        return (
          <SavingsProductListItem
            key={savingsProduct.id}
            savingsProduct={savingsProduct}
            isSelected={isSelected}
            handleSelectSavingsProduct={handleSelectProduct}
          />
        );
      })}
    </>
  );
}
