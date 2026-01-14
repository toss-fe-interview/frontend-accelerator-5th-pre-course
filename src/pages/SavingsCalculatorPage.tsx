import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorFallback from 'components/ErrorFallback';
import SuspenseFallback from 'components/SuspenseFallback';
import CalculationResult from 'features/savings/components/CalculationResult';
import SavingsInputs from 'features/savings/components/SavingsInputs';
import SavingsProductList from 'features/savings/components/SavingsProductList';
import { useSuspenseSavingsProducts } from 'features/savings/hooks/quries/useSuspenseSavingsProducts';
import useFilteredSavingsProducts from 'features/savings/hooks/useFilteredSavingsProducts';
import { SavingsValues } from 'features/savings/types/savingsValues';
import { SavingsTabs } from 'features/savings/types/tabs';
import { parseNumberInput } from 'features/savings/utils/parse/number';
import { ChangeEvent, useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';

export function SavingsCalculatorPage() {
  const [savingsValues, setSavingsValues] = useState<SavingsValues>({
    targetAmount: 0,
    monthlyPaymentAmount: 0,
    savingsPeriod: 6,
  });
  const [selectedTab, setSelectedTab] = useState<SavingsTabs>('products');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: savingsProducts } = useSuspenseSavingsProducts();

  const filteredSavingsProducts = useFilteredSavingsProducts(
    savingsProducts,
    savingsValues.monthlyPaymentAmount,
    savingsValues.savingsPeriod
  );

  const handleChagneTargetAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseNumberInput(e.target.value);

    setSavingsValues(prev => ({
      ...prev,
      targetAmount: newValue,
    }));
  };

  const handleChagneMonthlyPaymentAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseNumberInput(e.target.value);

    setSavingsValues(prev => ({
      ...prev,
      monthlyPaymentAmount: newValue,
    }));
  };

  const handleChangeSavingsPeriod = (newValue: number) => {
    setSavingsValues(prev => ({
      ...prev,
      savingsPeriod: newValue,
    }));
  };

  const changeSelectedProduct = (newValue: string) => {
    setSelectedProductId(newValue);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsInputs
        savingsValues={savingsValues}
        onChangeTargetAmount={handleChagneTargetAmount}
        onChangeMonthlyPaymentAmount={handleChagneMonthlyPaymentAmount}
        onChangeSavingsPeriod={handleChangeSavingsPeriod}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={(newValue: string) => {
          setSelectedTab(newValue as SavingsTabs);
        }}
      >
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={<SuspenseFallback />}>
          {selectedTab === 'products' ? (
            <SavingsProductList
              savingsProducts={filteredSavingsProducts}
              selectedProductId={selectedProductId}
              changeSelectedProduct={changeSelectedProduct}
              clickable
            />
          ) : (
            <CalculationResult
              savingsValues={savingsValues}
              savingsProducts={filteredSavingsProducts}
              selectedProductId={selectedProductId}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
