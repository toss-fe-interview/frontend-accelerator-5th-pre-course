import { Assets, Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';
import { getSavingsProducts, SavingsProduct } from 'pages/SavingCalculator/api/product';
import { SavingsProductItem } from 'pages/SavingCalculator/ui/SavingsProductItem';
import { CalculationResultItem } from 'pages/SavingCalculator/ui/CalculationResultItem';
import { SavingPeriodSelect } from 'pages/SavingCalculator/ui/SavingPeriodSelect';
import { queryOptions } from '@tanstack/react-query';
import { roundToThousand } from 'shared/utils/number';
import { EmptyMessage } from 'shared/ui/EmptyMessage';
import { eq, gt, lt } from 'es-toolkit/compat';
import { SuspenseQuery } from '@suspensive/react-query';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { NumberInput } from 'shared/ui/NumberField';

type Tab = 'products' | 'results';

const TOP_RECOMMENDATION_COUNT = 2;

const savingsProductsQueyOptions = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: getSavingsProducts,
  });

export function SavingsCalculatorPage() {
  const [filters, setFilters] = useState({
    targetAmount: 0,
    monthlyPayment: 0,
    savingPeriod: 12,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  const [tab, setTab] = useState<Tab>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <NumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={filters.targetAmount}
        onChange={value => setFilters(prev => ({ ...prev, targetAmount: value }))}
      />
      <Spacing size={16} />
      <NumberInput
        label="월 납입액"
        placeholder="월 납입액을 입력하세요"
        value={filters.monthlyPayment}
        onChange={value => setFilters(prev => ({ ...prev, monthlyPayment: value }))}
      />
      <Spacing size={16} />
      <SavingPeriodSelect
        title="저축 기간"
        value={filters.savingPeriod}
        onSelect={value => setFilters(prev => ({ ...prev, savingPeriod: value }))}
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
                    select={products => products.filter(product => filterSavingsProducts(product, filters))}
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
                            right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
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
                      name="예상 수익 금액"
                      amount={
                        filters.monthlyPayment * filters.savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5)
                      }
                    />
                    <CalculationResultItem
                      name="목표 금액과의 차이"
                      amount={
                        filters.targetAmount -
                        filters.monthlyPayment * filters.savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5)
                      }
                    />
                    <CalculationResultItem
                      name="추천 월 납입 금액"
                      amount={roundToThousand(
                        filters.targetAmount / (filters.savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5))
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
                          .filter(product => filterSavingsProducts(product, filters))
                          .sort(sortByAnnualRateDesc)
                          .slice(0, TOP_RECOMMENDATION_COUNT)
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
                              right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
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
  filters: { targetAmount: number; monthlyPayment: number; savingPeriod: number }
) => {
  return (
    gt(product.minMonthlyAmount, filters.monthlyPayment) &&
    lt(product.maxMonthlyAmount, filters.monthlyPayment) &&
    eq(product.availableTerms, filters.savingPeriod)
  );
};

const sortByAnnualRateDesc = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;
