import { Spacing, Border, ListHeader } from 'tosslib';
import { ProductList } from '../ui/ProductList';
import { useSavingsContext } from '../index';

export function RecommendedProductHeader() {
  const { topRateProducts, selectedProductId, setSelectProduct } = useSavingsContext();

  return (
    <>
      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      <ProductList
        list={topRateProducts}
        selectedProductId={selectedProductId}
        onProductClick={setSelectProduct}
        emptyMessage="추천 상품이 없습니다."
      />
    </>
  );
}
