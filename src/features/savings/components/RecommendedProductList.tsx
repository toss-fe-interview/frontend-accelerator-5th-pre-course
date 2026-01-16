import { Assets, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../types';
import { formatPrice } from 'shared/utils/price';

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
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatPrice(product.minMonthlyAmount)}원 ~ ${formatPrice(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          onClick={() => onSelect(product.id)}
        />
      ))}
    </>
  );
};
