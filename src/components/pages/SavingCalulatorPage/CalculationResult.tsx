import { useSavingProductsQuery } from 'queries/useSavingProductsQuery';
import { Border, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingProduct } from 'queries/types';
import { CalculationResultSummary } from './CalculationResultSummary';
import { RecommendProductList } from './RecommendProductList';

const ResultGuard = ({
  selectedProduct,
  children,
}: {
  selectedProduct: SavingProduct | null;
  children: (product: SavingProduct) => React.ReactNode;
}) => {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }
  return <>{children(selectedProduct)}</>;
};

export const CalculationResult = ({
  selectedProduct,
  setSelectedProduct,
}: {
  selectedProduct: SavingProduct | null;
  setSelectedProduct: (product: SavingProduct) => void;
}) => {
  return (
    <>
      <Spacing size={8} />

      <ResultGuard selectedProduct={selectedProduct}>
        {product => <CalculationResultSummary selectedProduct={product} />}
      </ResultGuard>

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <RecommendProductList selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
      <Spacing size={40} />
    </>
  );
};
