import { ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../types';
import { SavingsProductItem } from './SavingsProductItem';

type RecommendedProductListProps = {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
};

export const RecommendedProductList = ({ products, selectedProductId, onSelect }: RecommendedProductListProps) => {
  if (products.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="추천 상품이 존재하지 않습니다." />} />;
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
          onSelect={() => onSelect(product.id)}
        />
      ))}
    </>
  );
};
