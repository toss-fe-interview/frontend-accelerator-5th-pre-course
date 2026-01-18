import SavingsProductItem from 'features/savings/components/SavingsProduct';

import { TABS } from 'features/savings/constants';
import { savingsQueries } from 'features/savings/queries';
import { getMatchedSavingsProducts, handleAmountChange } from 'features/savings/utils/savings';
import { useSetQueryParams } from 'hooks/useSetQueryParams';
import { useTab } from 'hooks/useTab';

import { Suspense, useState } from 'react';
import { SavingsProduct } from 'model/types';

import { Border, NavigationBar, Spacing, Tab, TextField } from 'tosslib';
import SelectSavingsPeriodBottomSheet from 'features/savings/components/SelectSavingsPeriodBottomSheet';
import { ErrorBoundary } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import CalculationResult from 'features/savings/components/CalculationResult';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const { currentTab, changeTab } = useTab({ key: 'tab', defaultTab: TABS.PRODUCTS });

  const { searchParams, setQueryParams } = useSetQueryParams();
  const goalAmount = searchParams.get('goalAmount') || '';
  const monthlyAmount = searchParams.get('monthlyAmount') || '';
  const period = Number(searchParams.get('period')) || 0;

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmount}
        onChange={e => {
          handleAmountChange(e, value => {
            setQueryParams('goalAmount', value);
            setSelectedProduct(null);
          });
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={e => {
          handleAmountChange(e, value => {
            setQueryParams('monthlyAmount', value);
            setSelectedProduct(null);
          });
        }}
      />
      <Spacing size={16} />
      <SelectSavingsPeriodBottomSheet
        label="저축 기간"
        period={period}
        onChange={value => {
          setQueryParams('period', value.toString());
          setSelectedProduct(null);
        }}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={changeTab}>
        <Tab.Item value="products" selected={currentTab === TABS.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={currentTab === TABS.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>
      {currentTab === TABS.PRODUCTS && (
        <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
          <Suspense fallback={<>{'상품 목록을 가져오고 있어요'}</>}>
            <SuspenseQuery {...savingsQueries.list()}>
              {({ data: savingsProducts }) => {
                const matched = getMatchedSavingsProducts({
                  savingsProducts,
                  monthlyAmount,
                  period,
                });
                const displayProducts = matched.length === 0 ? savingsProducts : matched;
                return (
                  <>
                    {displayProducts.map(product => (
                      <SavingsProductItem
                        key={product.id}
                        product={product}
                        isSelected={product.id === selectedProduct?.id}
                        onSelect={setSelectedProduct}
                      />
                    ))}
                  </>
                );
              }}
            </SuspenseQuery>
          </Suspense>
        </ErrorBoundary>
      )}

      {currentTab === TABS.RESULTS && (
        <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
          <Suspense fallback={<>{'계산 결과를 가져오고 있어요'}</>}>
            <SuspenseQuery {...savingsQueries.list()}>
              {({ data: savingsProducts }) => {
                return (
                  <CalculationResult
                    selectedProduct={selectedProduct}
                    savingsProducts={savingsProducts}
                    goalAmount={goalAmount}
                    monthlyAmount={monthlyAmount}
                    period={period}
                  />
                );
              }}
            </SuspenseQuery>
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
