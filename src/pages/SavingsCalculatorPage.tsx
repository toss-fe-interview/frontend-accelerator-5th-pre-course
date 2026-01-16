import { SuspenseQuery } from '@suspensive/react-query';
import { CalculationResult } from 'components/CalculationResult';
import { NumberField } from 'components/NumberField';
import { SavingsProductRecord } from 'components/SavingsProductRecord';
import { TermSelector } from 'components/TermSelector';
import { hasMonthlyAmountInRange, hasTermMatch } from 'domains/savings-product';
import { defaultTo } from 'es-toolkit/compat';
import { useSavingsProductSearchParams } from 'hooks/use-savings-product-search-params';
import { Suspense, useState } from 'react';
import { getSavingsProductsQueryOptions } from 'remotes/savings-product';
import { Border, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import type { SavingsProduct } from 'types';
import { IIFE, withTypeGuard } from 'utils/fn';

function SavingsCalculatorPage() {
  const { filters, updateFilters } = useSavingsProductSearchParams();
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <NumberField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={filters.goalAmount == null ? undefined : filters.goalAmount}
        onValueChange={value => {
          updateFilters(prev => ({
            ...prev,
            goalAmount: value,
          }));
        }}
      />
      <Spacing size={16} />
      <NumberField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={filters.monthlyAmount == null ? undefined : filters.monthlyAmount}
        onValueChange={value => {
          updateFilters(prev => ({
            ...prev,
            monthlyAmount: value,
          }));
        }}
      />
      <Spacing size={16} />
      <TermSelector
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={filters.term}
        onSelect={value => {
          updateFilters(prev => ({
            ...prev,
            term: value,
          }));
        }}
      />
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={withTypeGuard(isTabEnum, tab => {
          updateFilters(prev => ({ ...prev, tab }));
        })}
      >
        <Tab.Item value="products" selected={filters.tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={filters.tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      <Suspense>
        {IIFE(() => {
          switch (filters.tab) {
            case 'products':
              return (
                <SuspenseQuery {...getSavingsProductsQueryOptions()}>
                  {({ data: savingsProducts }) => {
                    return (
                      <>
                        {filterSavingsProducts(savingsProducts, {
                          monthlyAmount: filters.monthlyAmount,
                          term: filters.term,
                        }).map(savingsProduct => {
                          const isSelected = selectedSavingsProduct?.id === savingsProduct.id;
                          return (
                            <SavingsProductRecord
                              key={savingsProduct.id}
                              savingsProduct={savingsProduct}
                              selected={isSelected}
                              onSelect={savingsProduct => {
                                if (isSelected) {
                                  setSelectedSavingsProduct(null);
                                } else {
                                  setSelectedSavingsProduct(savingsProduct);
                                }
                              }}
                            />
                          );
                        })}
                      </>
                    );
                  }}
                </SuspenseQuery>
              );
            case 'results':
              return (
                <SuspenseQuery {...getSavingsProductsQueryOptions()}>
                  {({ data: savingsProducts }) => {
                    return (
                      <>
                        {selectedSavingsProduct ? (
                          <CalculationResult
                            selectedSavingsProduct={selectedSavingsProduct}
                            savingsProducts={filterSavingsProducts(savingsProducts, {
                              monthlyAmount: filters.monthlyAmount,
                              term: filters.term,
                            })}
                            monthlyAmount={filters.monthlyAmount}
                            term={filters.term}
                            goalAmount={filters.goalAmount}
                          />
                        ) : (
                          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
                        )}
                      </>
                    );
                  }}
                </SuspenseQuery>
              );
          }
        })}
      </Suspense>
    </>
  );
}

export { SavingsCalculatorPage };

function filterSavingsProducts(
  savingsProducts: SavingsProduct[],
  {
    monthlyAmount,
    term,
  }: {
    monthlyAmount?: number;
    term?: number;
  }
) {
  return savingsProducts
    .filter(hasMonthlyAmountInRange(defaultTo(monthlyAmount, 0)))
    .filter(hasTermMatch(defaultTo(term, 0)));
}

function isTabEnum(value: unknown): value is 'products' | 'results' {
  return ['products', 'results'].some(tab => tab === value);
}
