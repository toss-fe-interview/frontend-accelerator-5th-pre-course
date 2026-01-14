import { useQuery } from '@tanstack/react-query';
import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { savingsProductsQueries } from '../api/queries';
import { useSelectProductParams } from '../hooks/useSelectProductParams';
import CalculationSummary from './CalculationSummary';

export default function CalculationResult() {
  const { data: products } = useQuery(savingsProductsQueries.listQuery());
  const { selectedProductId } = useSelectProductParams();

  const selectedProduct = products?.find(product => product.id === selectedProductId);

  return (
    <div>
      <Spacing size={8} />

      {selectedProduct ? (
        <CalculationSummary product={selectedProduct} />
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <RecommendedProductList />
      <Spacing size={40} />
    </div>
  );
}

function RecommendedProductList() {
  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'기본 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 3.2%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`100,000원 ~ 500,000원 | 12개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'고급 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 2.8%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`50,000원 ~ 1,000,000원 | 24개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />
    </>
  );
}
