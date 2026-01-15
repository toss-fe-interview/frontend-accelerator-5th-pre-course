import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorFallback from 'components/ErrorFallback';
import SuspenseFallback from 'components/SuspenseFallback';
import CalculationResult from 'features/savings/components/CalculationResult';
import SavingsFieldInput from 'features/savings/components/SavingsFieldInput';
import SavingsProductList from 'features/savings/components/SavingsProductList';
import { useSuspenseSavingsProducts } from 'features/savings/hooks/quries/useSuspenseSavingsProducts';
import { SavingsValues } from 'features/savings/types/savingsValues';
import { SavingsTabs } from 'features/savings/types/tabs';
import { formatNumberWithComma } from 'features/savings/utils/format/number';
import { parseNumberInput } from 'features/savings/utils/parse/number';
import { filterSavings } from 'features/savings/utils/product/savings';
import { ChangeEvent, useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

export function SavingsCalculatorPage() {
  const [savingsValues, setSavingsValues] = useState<SavingsValues>({
    targetAmount: 0,
    monthlyPaymentAmount: 0,
    savingsPeriod: 6,
  });
  const [selectedTab, setSelectedTab] = useState<SavingsTabs>('products');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: savingsProducts } = useSuspenseSavingsProducts();

  const changeSelectedProduct = (newValue: string) => {
    setSelectedProductId(newValue);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsFieldInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={savingsValues.targetAmount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newValue = parseNumberInput(e.target.value);

          setSavingsValues(prev => ({
            ...prev,
            targetAmount: newValue,
          }));
        }}
      />
      <Spacing size={16} />
      <SavingsFieldInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={savingsValues.monthlyPaymentAmount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newValue = parseNumberInput(e.target.value);

          setSavingsValues(prev => ({
            ...prev,
            monthlyPaymentAmount: newValue,
          }));
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsValues.savingsPeriod}
        onChange={(newValue: number) => {
          setSavingsValues(prev => ({
            ...prev,
            savingsPeriod: newValue,
          }));
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={18}>18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

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
              savingsProducts={filterSavings(
                savingsProducts,
                savingsValues.monthlyPaymentAmount,
                savingsValues.savingsPeriod
              )}
              selectedProductId={selectedProductId}
              changeSelectedProduct={changeSelectedProduct}
              clickable
            />
          ) : (
            <CalculationResult
              savingsValues={savingsValues}
              savingsProducts={filterSavings(
                savingsProducts,
                savingsValues.monthlyPaymentAmount,
                savingsValues.savingsPeriod
              )}
              selectedProductId={selectedProductId}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
