import type { SavingProduct as SavingProductType } from 'product/type/internal';
import SavingProduct from './SavingProduct';

type Props = {
  data: SavingProductType[];
  selectedProduct: SavingProductType | null;
  selectProduct: (product: SavingProductType) => void;
};

const SavingProducts = ({ data, selectedProduct, selectProduct }: Props) => {
  return data.map(product => (
    <SavingProduct
      key={product.id}
      product={product}
      onClick={() => {
        selectProduct(product);
      }}
      selected={selectedProduct?.id === product.id}
    />
  ));
};

export default SavingProducts;
