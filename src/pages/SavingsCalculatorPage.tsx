import { useGetSavingsProduct } from 'hooks/useGetSavingsProduct';
import { useSavingsCalculate } from 'hooks/useSavingsCalculate';
import { Tabs } from 'model/types';
import { useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import CalculationResult from 'ui/CaculationResult';
import CalculateForm from 'ui/CalculateForm';
import SavingProductList from 'ui/SavingProductList';

export function SavingsCalculatorPage() {
  const savingsProducts = useGetSavingsProduct();
  const [currentTab, setCurrentTab] = useState<Tabs>('products');
  const { state, action } = useSavingsCalculate(savingsProducts);
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />
      <CalculateForm state={state} action={action} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          setCurrentTab(value as Tabs);
        }}
      >
        <Tab.Item value="products" selected={currentTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={currentTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {currentTab === 'products' && <SavingProductList state={state} action={action} />}

      {currentTab === 'results' && (
        <CalculationResult
          selectedProduct={state.selectedProduct}
          expextedProfit={state.expextedProfit}
          diffBetweenGoalandExpected={state.diffBetweenGoalandExpected}
          recomendAmountForMonth={state.recomendAmountForMonth}
          recomendedProduct={state.recomendedProduct}
        />
      )}
    </>
  );
}
