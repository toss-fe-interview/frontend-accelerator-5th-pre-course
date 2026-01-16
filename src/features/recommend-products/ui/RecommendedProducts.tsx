import { SavingsProduct } from 'entities/savings-product/model/types';
import SavingsProductItem from 'entities/savings-product/ui/SavingsProductItem';
import { ListHeader, ListRow, Spacing } from 'tosslib';

interface RecommendedProductsProps {
  products: SavingsProduct[];
  selectedProductId: string;
}

const RecommendedProducts = ({ products, selectedProductId }: RecommendedProductsProps) => {
  if (products.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="추천 상품이 없습니다." />} />;
  }

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {products.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          selected={selectedProductId === product.id}
          onClick={() => {}}
        />
      ))}

      <Spacing size={40} />
    </>
  );
};

export default RecommendedProducts;
