import { ListHeader, ListRow, Spacing } from 'tosslib';
import type { SavingsProduct } from '../api/api';
import { useSelectProductParams } from '../hooks/useSelectProductParams';
import ProductList from './ProductList';

export default function RecommendedProductList({ products }: { products?: SavingsProduct[] }) {
  const { selectedProductId, setSelectedProductId } = useSelectProductParams();

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {products ? (
        <ProductList
          products={products}
          selectedProductId={selectedProductId ?? undefined}
          onProductSelect={setSelectedProductId}
        />
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
      )}
      <Spacing size={40} />
    </>
  );
}
