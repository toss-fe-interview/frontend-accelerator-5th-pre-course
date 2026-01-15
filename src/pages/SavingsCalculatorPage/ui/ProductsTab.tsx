import { SavingsProduct } from 'entities/savings-product/model/types';
import SavingsProductItem from 'entities/savings-product/ui/SavingsProductItem';
import { ListRow } from 'tosslib';

interface ProductsTabProps {
  products: SavingsProduct[];
  selectedProduct: SavingsProduct | null;
  onSelectProduct: (product: SavingsProduct) => void;
  isLoading: boolean;
  error: unknown;
}

const ProductsTab = ({ products, selectedProduct, onSelectProduct, isLoading, error }: ProductsTabProps) => {
  if (isLoading) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중입니다..." />} />;
  }

  if (error) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중에 오류가 발생했습니다." />} />;
  }

  return (
    <>
      {products.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          selected={selectedProduct?.id === product.id}
          onClick={() => onSelectProduct(product)}
        />
      ))}
    </>
  );
};

export default ProductsTab;
