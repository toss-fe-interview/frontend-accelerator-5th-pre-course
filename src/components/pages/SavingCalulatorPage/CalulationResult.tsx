import { useSavingProductsQuery } from 'queries/useSavingProductsQuery';
import { useWatch } from 'react-hook-form';
import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { isAffordableProducts } from 'utils/savingProductFilter';
import { ProductItem } from './ProductItem';
import { SavingProduct } from 'queries/types';
import { CalculationResultSummary } from './CalculationResultSummary';

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

export const CalulationResult = ({
  selectedProduct,
  setSelectedProduct,
}: {
  selectedProduct: SavingProduct | null;
  setSelectedProduct: (product: SavingProduct) => void;
}) => {
  const { data: savingProducts } = useSavingProductsQuery();
  const { monthlyAmount, term } = useWatch();

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

      {/* TODO: 로직 분리 */}
      {savingProducts
        ?.filter(product => isAffordableProducts(product, monthlyAmount, term))
        .sort((a, b) => b.annualRate - a.annualRate)
        .slice(0, 2)
        .map(product => (
          <ProductItem
            savingProduct={product}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        ))}

      <Spacing size={40} />
    </>
  );
};
