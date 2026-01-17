import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';
import { getSavingsProducts, SavingsProduct } from 'api/product';
import { CheckCircleIcon } from 'components/CheckCircleIcon';
import { SavingsProductItem } from 'components/SavingsProductItem';
import { CalculationResultItem } from 'components/CalculationResultItem';
import { SavingPeriodSelect } from 'components/SavingPeriodSelect';
import { queryOptions } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { roundToThousand } from 'util/number';
import { EmptyMessage } from 'components/EmptyMessage';
import { eq, gt, lt } from 'es-toolkit/compat';
import { SuspenseQuery } from '@suspensive/react-query';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { NumberInput } from 'components/NumberField';

type Tab = 'products' | 'results';

const savingsProductsQueyOptions = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: getSavingsProducts,
  });

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
  const [tab, setTab] = useState<Tab>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <NumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={value => setValue('targetAmount', value)}
      />
      <Spacing size={16} />
      <NumberInput
        label="월 납입액"
        placeholder="월 납입액을 입력하세요"
        value={monthlyPayment}
        onChange={value => setValue('monthlyPayment', value)}
      />
      <Spacing size={16} />
      <SavingPeriodSelect
        value={savingPeriod}
        onSelect={value => setValue('savingPeriod', value)}
        options={[
          { value: 6, label: '6개월' },
          { value: 12, label: '12개월' },
          { value: 24, label: '24개월' },
        ]}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          setTab(value as Tab);
        }}
      >
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {(() => {
        switch (tab) {
          case 'products':
            return (
              <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
                <Suspense fallback={'loading...'}>
                  <SuspenseQuery
                    {...savingsProductsQueyOptions()}
                    select={products =>
                      products.filter(product => filterSavingsProducts(product, { monthlyPayment, savingPeriod }))
                    }
                  >
                    {({ data: products }) =>
                      products.map(product => {
                        const isSelected = selectedSavingsProduct?.id === product.id;
                        return (
                          <ListRow
                            key={product.id}
                            contents={
                              <SavingsProductItem
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
                      })
                    }
                  </SuspenseQuery>
                </Suspense>
              </ErrorBoundary>
            );
          case 'results':
            return (
              <>
                <Spacing size={8} />

                {selectedSavingsProduct ? (
                  <>
                    <CalculationResultItem
                      label="예상 수익 금액"
                      value={monthlyPayment * savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5)}
                    />
                    <CalculationResultItem
                      label="목표 금액과의 차이"
                      value={
                        targetAmount - monthlyPayment * savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5)
                      }
                    />
                    <CalculationResultItem
                      label="추천 월 납입 금액"
                      value={roundToThousand(
                        targetAmount / (savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5))
                      )}
                    />
                  </>
                ) : (
                  <EmptyMessage message="상품을 선택해주세요." />
                )}

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />

                <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
                  <Suspense fallback={'loading...'}>
                    <SuspenseQuery
                      {...savingsProductsQueyOptions()}
                      select={products =>
                        products
                          .filter(product => filterSavingsProducts(product, { monthlyPayment, savingPeriod }))
                          .sort(sortByAnnualRateDesc)
                          .slice(0, 2)
                      }
                    >
                      {({ data: products }) =>
                        products.map(product => {
                          const isSelected = selectedSavingsProduct?.id === product.id;
                          return (
                            <ListRow
                              key={product.id}
                              contents={
                                <SavingsProductItem
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
                        })
                      }
                    </SuspenseQuery>
                  </Suspense>
                </ErrorBoundary>

                <Spacing size={40} />
              </>
            );
        }
      })()}
    </>
  );
}

const filterSavingsProducts = (
  product: SavingsProduct,
  { monthlyPayment, savingPeriod }: { monthlyPayment: number; savingPeriod: number }
) => {
  return (
    gt(product.minMonthlyAmount, monthlyPayment) &&
    lt(product.maxMonthlyAmount, monthlyPayment) &&
    eq(product.availableTerms, savingPeriod)
  );
};

const sortByAnnualRateDesc = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;
