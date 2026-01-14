import { Border, ListHeader, ListRow, Spacing, Tab } from 'tosslib';
import { Suspense, useState } from 'react';
import { SavingProduct } from 'queries/types';
import { SavingProductList } from 'components/pages/SavingCalulatorPage/SavingProductList';
import { TAB_STATE, useSavingCalculatorTab } from 'hooks/useSavingCalculatorTab';
import { Loading } from 'components/common/Loading';
import { CalculationResultSummary } from 'components/pages/SavingCalulatorPage/CalculationResultSummary';
import { CalculationResultProductList } from './CalculationResultProductList';

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

export const SavingsCalculatorContent = () => {
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);
  const { tabState, handleTabState } = useSavingCalculatorTab();

  return (
    <>
      <Tab onChange={handleTabState}>
        <Tab.Item value={TAB_STATE.PRODUCTS} selected={tabState === TAB_STATE.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_STATE.RESULTS} selected={tabState === TAB_STATE.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      <Suspense fallback={<Loading />}>
        {tabState === TAB_STATE.PRODUCTS && (
          <SavingProductList selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
        )}

        {tabState === TAB_STATE.RESULTS && (
          <>
            <Spacing size={8} />
            <ResultGuard selectedProduct={selectedProduct}>
              {product => <CalculationResultSummary selectedProduct={product} />}
            </ResultGuard>

            <Spacing size={8} />
            <Border height={16} />
            <Spacing size={8} />

            <ListHeader
              title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
            />
            <Spacing size={12} />
            <CalculationResultProductList selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            <Spacing size={40} />
          </>
        )}
      </Suspense>
    </>
  );
};
