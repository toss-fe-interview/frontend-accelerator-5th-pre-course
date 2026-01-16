import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from 'shared/types';
import { formatNumber } from 'shared/utils';

interface SavingsProductListProps {
  filteredProducts: SavingsProduct[];
  selectedProductId: string | null;
  onClickProduct: (productId: string) => void;
}

export const SavingsProductList = ({
  filteredProducts,
  selectedProductId,
  onClickProduct,
}: SavingsProductListProps) => {
  return filteredProducts.map((product: SavingsProduct) => {
    const isSelected = selectedProductId === product.id;

    return (
      <ListRow
        key={product.id}
        onClick={() => onClickProduct(product.id)}
        right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
        contents={content(product)}
      />
    );
  });
};
