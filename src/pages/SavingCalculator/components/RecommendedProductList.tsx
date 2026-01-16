import { Border, ListHeader, Spacing } from 'tosslib';
import { SavingsProduct } from '../api';
import { SavingItem } from './SavingItemList';

interface RecommendedProductListProps {
  products: SavingsProduct[];
}

export function RecommendedProductList({ products }: RecommendedProductListProps) {
  return (
    <>
      <Border height={16} />
      <Spacing size={8} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {products.map(product => (
        <SavingItem key={product.id} product={product} selectedProduct={null} onSelect={() => {}} />
      ))}
      <Spacing size={40} />
    </>
  );
}
