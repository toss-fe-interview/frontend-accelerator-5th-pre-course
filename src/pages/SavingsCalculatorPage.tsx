import { Border, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';
import { getSavingsProducts, SavingsProduct } from 'api/product';
import { CalculationResult } from 'components/CalculationResult';
import { CheckCircleIcon } from 'components/CheckCircleIcon';
import { GoalAmountInput } from 'components/GoalAmountInput';
import { MonthlyPaymentInput } from 'components/MonthlyPaymentInput';
import { Product } from 'components/Product';
import { SavingPeriodSelect } from 'components/SavingPeriodSelect';
import { useTabState, Tab as TabType } from 'hooks/useTabState';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const productQueries = {
  all: () =>
    queryOptions({
      queryKey: ['savingsProducts'],
      queryFn: getSavingsProducts,
    }),
};

interface SavingsFormData {
  targetAmount: number;
  monthlyPayment: number;
  savingPeriod: number;
}

export function SavingsCalculatorPage() {
  const { watch, setValue } = useForm<SavingsFormData>({
    defaultValues: {
      targetAmount: 0,
      monthlyPayment: 0,
      savingPeriod: 12,
    },
  });
  const { targetAmount, monthlyPayment, savingPeriod } = watch();
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  const { selectedTab, setSelectedTab } = useTabState();

  const { data: savingsProducts } = useSuspenseQuery(productQueries.all());

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <GoalAmountInput value={targetAmount} onChange={v => setValue('targetAmount', v)} />
      <Spacing size={16} />
      <MonthlyPaymentInput value={monthlyPayment} onChange={v => setValue('monthlyPayment', v)} />
      <Spacing size={16} />
      <SavingPeriodSelect value={savingPeriod} onChange={v => setValue('savingPeriod', v)} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          setSelectedTab(value as TabType);
        }}
      >
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' &&
        (() => {
          const filteredSavingProducts = savingsProducts.filter(product => {
            return (
              product.minMonthlyAmount < monthlyPayment &&
              product.maxMonthlyAmount > monthlyPayment &&
              product.availableTerms === savingPeriod
            );
          });

          return filteredSavingProducts.map(product => {
            const isSelected = selectedSavingsProduct?.id === product.id;
            return (
              <ListRow
                key={product.id}
                contents={
                  <Product
                    name={product.name}
                    annualRate={product.annualRate}
                    minMonthlyAmount={product.minMonthlyAmount}
                    maxMonthlyAmount={product.maxMonthlyAmount}
                    availableTerms={product.availableTerms}
                  />
                }
                right={isSelected ? <CheckCircleIcon /> : null}
                onClick={() => {
                  setSelectedSavingsProduct(product);
                }}
              />
            );
          });
        })()}
      {selectedTab === 'results' && (
        <CalculationResult
          targetAmount={targetAmount}
          monthlyPayment={monthlyPayment}
          savingPeriod={savingPeriod}
          selectedSavingsProduct={selectedSavingsProduct}
          onSelectProduct={setSelectedSavingsProduct}
        />
      )}
    </>
  );
}
