import { FormProvider, useForm } from 'react-hook-form';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { CalculatorFormInputs } from 'components/pages/SavingCalulatorPage/CalculatorFormInputs';
import { Suspense, useState } from 'react';
import { SavingProduct } from 'queries/types';
import { SavingProductList } from 'components/pages/SavingCalulatorPage/SavingProductList';
import { TAB_STATE, useSavingCalculatorTab } from 'hooks/useSavingCalculatorTab';
import { Loading } from 'components/common/Loading';
import { CalculationResultSummary } from 'components/pages/SavingCalulatorPage/CalculationResultSummary';
import { RecommendProductList } from 'components/pages/SavingCalulatorPage/RecommendProductList';

type CalculatorForm = {
  monthlyAmount: number | null;
  targetAmount: number | null;
  term: number;
};

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

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);
  const { tabState, handleTabState } = useSavingCalculatorTab();
  const methods = useForm<CalculatorForm>({
    defaultValues: {
      monthlyAmount: null,
      targetAmount: null,
      term: 12,
    },
  });

  return (
    <FormProvider {...methods}>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <CalculatorFormInputs />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

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
            <RecommendProductList selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            <Spacing size={40} />
          </>
        )}
      </Suspense>
    </FormProvider>
  );
}
