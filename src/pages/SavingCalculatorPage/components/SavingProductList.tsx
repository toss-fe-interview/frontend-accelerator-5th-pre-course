import { SavingProduct } from 'models/SavingProduct';
import { ListRow } from 'tosslib';
import { SavingProductListItem } from './SavingProductListItem';

export const SavingProductList = ({
  savingsProducts,
  selectedSavingProduct,
  selectSavingProduct,
}: {
  savingsProducts: SavingProduct[];
  selectedSavingProduct: SavingProduct | null;
  selectSavingProduct: (product: SavingProduct) => void;
}) => {
  if (savingsProducts.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="더 많은 상품을 준비 중이에요!" />} />;
  }

  return (
    <div>
      {savingsProducts.map(product => (
        <SavingProductListItem
          key={product.id}
          product={product}
          isSelected={selectedSavingProduct?.id === product.id}
          onSelect={selectSavingProduct}
        />
      ))}
    </div>
  );
};
