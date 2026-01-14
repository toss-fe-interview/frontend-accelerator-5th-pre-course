import { Controller, FormProvider, useForm } from 'react-hook-form';
import { SavingsCalculatorInputs } from 'components/pages/SavingCalulatorPage/SavingsCalculatorInputs';
import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { Suspense, useState } from 'react';
import { SavingProduct } from 'queries/types';
import { SavingProductList } from 'components/pages/SavingCalulatorPage/SavingProductList';
import { TAB_STATE, useSavingCalculatorTab } from 'hooks/useSavingCalculatorTab';
import { Loading } from 'components/common/Loading';
import { CalculationResultSummary } from 'components/pages/SavingCalulatorPage/CalculationResultSummary';
import { CalculationResultProductList } from 'components/pages/SavingCalulatorPage/CalculationResultProductList';
import { TextFieldForKRW } from 'components/common/TextFieldForKRW';

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
  const methods = useForm<CalculatorForm>({
    defaultValues: {
      monthlyAmount: null,
      targetAmount: null,
      term: 12,
    },
  });
  const { tabState, handleTabState } = useSavingCalculatorTab();

  return (
    <FormProvider {...methods}>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <Controller
        name="targetAmount"
        control={methods.control}
        render={({ field }) => (
          <TextFieldForKRW
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="monthlyAmount"
        control={methods.control}
        render={({ field }) => (
          <TextFieldForKRW
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="term"
        control={methods.control}
        render={({ field }) => (
          <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" {...field}>
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />

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
            <CalculationResultProductList selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            <Spacing size={40} />
          </>
        )}
      </Suspense>
    </FormProvider>
  );
}
