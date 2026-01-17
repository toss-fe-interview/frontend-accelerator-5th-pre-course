import React from 'react';
import { ListHeader, Spacing } from 'tosslib';
import { ProductItem } from 'types/products';

interface RecommendProductListProps {
  items: ProductItem[];
  renderItem: (product: ProductItem) => JSX.Element;
}

export default function RecommendProductList({ items, renderItem }: RecommendProductListProps) {
  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />{' '}
      <Spacing size={12} />
      {items.map(item => (
        <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
      ))}
    </>
  );
}
