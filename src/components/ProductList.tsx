import { SavingsProduct } from 'type';
import { SavingsProductItem } from './SavingsProductItem';
import { ListRow } from 'tosslib';

interface ProductListProps {
  filteredSavingsProducts: SavingsProduct[];
  selectedSavingsProduct: SavingsProduct | null;
  setSelectedSavingsProduct: (product: SavingsProduct) => void;
}

export function ProductList(props: ProductListProps) {
  const { filteredSavingsProducts, selectedSavingsProduct, setSelectedSavingsProduct } = props;

  if (filteredSavingsProducts.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="입력한 조건에 맞는 상품이 없습니다." />} />;
  }

  return (
    <>
      {filteredSavingsProducts.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          selected={selectedSavingsProduct?.id === product.id}
          onClick={() => setSelectedSavingsProduct(product)}
        />
      ))}
    </>
  );
}
