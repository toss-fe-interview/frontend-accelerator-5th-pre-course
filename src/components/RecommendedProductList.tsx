import { ListHeader, ListRow, Spacing } from 'tosslib';
import { ProductInfoTexts } from 'components/ProductInfoTexts';
import { SavingsProduct } from 'type';

interface RecommendedProductListProps {
  products: SavingsProduct[];
}

export function RecommendedProductList({ products }: RecommendedProductListProps) {
  const byHighestRate = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;

  const recommendedProducts = [...products].sort(byHighestRate).slice(0, 2);

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {recommendedProducts.map(product => (
        <ListRow key={product.id} contents={<ProductInfoTexts product={product} />} />
      ))}
    </>
  );
}
