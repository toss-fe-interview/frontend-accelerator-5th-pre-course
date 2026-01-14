import { FormProvider, useForm } from 'react-hook-form';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { CalculatorFormInputs } from 'components/pages/SavingCalulatorPage/CalculatorFormInputs';
import { Suspense, useState } from 'react';
import { SavingProduct } from 'queries/types';
import { SavingProductList } from 'components/pages/SavingCalulatorPage/SavingProductList';
import { isTabType, TAB_STATE, useSavingCalculatorTab } from 'hooks/useSavingCalculatorTab';
import { Loading } from 'components/common/Loading';
import { CalculationResult } from 'components/pages/SavingCalulatorPage/CalculationResult';

type CaluculatorForm = {
  monthlyAmount: number | null;
  targetAmount: number | null;
  term: number;
};

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);
  const [tabState, setTabState] = useSavingCalculatorTab();
  const methods = useForm<CaluculatorForm>({
    defaultValues: {
      monthlyAmount: null,
      targetAmount: null,
      term: 12,
    },
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <FormProvider {...methods}>
        <CalculatorFormInputs />

        <Spacing size={24} />
        <Border height={16} />
        <Spacing size={8} />

        <Tab
          onChange={value => {
            if (isTabType(value)) {
              setTabState(value);
            }
          }}
        >
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
            <CalculationResult selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
          )}
        </Suspense>
      </FormProvider>
    </>
  );
}
