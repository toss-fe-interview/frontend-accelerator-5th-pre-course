import { FormProvider, useForm } from 'react-hook-form';
import { useSavingProductsQuery } from 'queries/useSavingProductsQuery';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { CalculatorFormInputs } from 'components/pages/SavingCalulatorPage/CalculatorFormInputs';
import { useState } from 'react';
import { SavingProduct } from 'queries/types';
import { SavingProductList } from 'components/pages/SavingCalulatorPage/SavingProductList';
import { CalulationResult } from 'components/pages/SavingCalulatorPage/CalulationResult';

type CaluculatorForm = {
  monthlyAmount: number | null;
  targetAmount: number | null;
  term: number;
};

const TAB_STATE = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabType = (typeof TAB_STATE)[keyof typeof TAB_STATE];

export function SavingsCalculatorPage() {
  const { data: savingProducts } = useSavingProductsQuery();
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);
  const [tabState, setTabState] = useState<TabType>(TAB_STATE.PRODUCTS);
  const methods = useForm<CaluculatorForm>({
    defaultValues: {
      monthlyAmount: null,
      targetAmount: null,
      term: 12,
    },
  });

  const isTabType = (value: string): value is TabType => {
    return Object.values(TAB_STATE).includes(value as TabType);
  };

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

        {tabState === TAB_STATE.PRODUCTS && (
          <SavingProductList
            savingProducts={savingProducts}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        {tabState === TAB_STATE.RESULTS && <CalulationResult />}
      </FormProvider>
    </>
  );
}
