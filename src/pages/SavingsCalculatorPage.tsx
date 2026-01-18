import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';

import {
  calculateExpectedProfit,
  calculateDifferenceProfit,
  calculateRecommendedMonthlyAmount,
  filterByConditions,
  isWithinAmountRange,
  hasMatchingTerm,
  pipe,
  sortByAnnualRate,
  take,
} from 'utils/calculateSavings';
import { SavingsProduct } from 'types/savings';
import { getSavingsProductsQueryOptions } from 'api/savings-products';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';

import { AmountField } from 'components/AmountField';
import { TermSelect } from 'components/TermSelect';
import { SavingsProductListItem } from 'components/SavingsProductListItem';
import { LabelValueRow } from 'components/LabelValueRow';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);
  const [savingsTerm, setSavingsTerm] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<'products' | 'results'>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <AmountField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={setTargetAmount}
      />
      <Spacing size={16} />
      <AmountField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={monthlyAmount}
        onChange={setMonthlyAmount}
      />
      <Spacing size={16} />
      <TermSelect
        label="저축 기간"
        value={savingsTerm}
        onChange={setSavingsTerm}
        options={[
          { label: '6개월', value: 6 },
          { label: '12개월', value: 12 },
          { label: '18개월', value: 18 },
          { label: '24개월', value: 24 },
        ]}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setCurrentTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={isSelected(currentTab, 'products')}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={isSelected(currentTab, 'results')}>
          계산 결과
        </Tab.Item>
      </Tab>
      <ErrorBoundary fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="에러가 발생했습니다." />} />}>
        <Suspense fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="로딩 중입니다..." />} />}>
          {(() => {
            switch (currentTab) {
              case 'products':
                return (
                  <SuspenseQuery
                    {...getSavingsProductsQueryOptions()}
                    select={pipe(
                      filterByConditions<SavingsProduct>(
                        (product: SavingsProduct) => isWithinAmountRange(product, monthlyAmount),
                        (product: SavingsProduct) => hasMatchingTerm(product, savingsTerm)
                      )
                    )}
                  >
                    {({ data: filteredSavingsProducts }: { data: SavingsProduct[] }) =>
                      filteredSavingsProducts.map(product => (
                        <SavingsProductListItem
                          key={product.id}
                          name={product.name}
                          annualRate={product.annualRate}
                          monthlyAmountRange={{
                            min: product.minMonthlyAmount,
                            max: product.maxMonthlyAmount,
                          }}
                          availableTerms={product.availableTerms}
                          isSelected={selectedProduct?.id === product.id}
                          onSelect={() => setSelectedProduct(product)}
                        />
                      ))
                    }
                  </SuspenseQuery>
                );
              case 'results':
                return (
                  <SuspenseQuery
                    {...getSavingsProductsQueryOptions()}
                    select={pipe(
                      filterByConditions<SavingsProduct>(
                        (product: SavingsProduct) => isWithinAmountRange(product, monthlyAmount),
                        (product: SavingsProduct) => hasMatchingTerm(product, savingsTerm)
                      ),
                      sortByAnnualRate('desc'),
                      take(2)
                    )}
                  >
                    {({ data: recommendedSavingsProducts }: { data: SavingsProduct[] }) => {
                      if (!selectedProduct) {
                        return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
                      }

                      const expectedProfit = calculateExpectedProfit({
                        monthlyAmount: monthlyAmount ?? 0,
                        savingsTerm: savingsTerm ?? 1,
                        annualRate: selectedProduct.annualRate,
                      });

                      const differenceProfit = calculateDifferenceProfit({
                        targetAmount: targetAmount ?? 0,
                        expectedProfit,
                      });

                      const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount({
                        targetAmount: targetAmount ?? 0,
                        savingsTerm: savingsTerm ?? 1,
                        annualRate: selectedProduct.annualRate,
                      });

                      return (
                        <>
                          <Spacing size={8} />
                          <>
                            <LabelValueRow label="예상 수익 금액" value={expectedProfit} />
                            <LabelValueRow label="목표 금액과의 차이" value={differenceProfit} />
                            <LabelValueRow label="추천 월 납입 금액" value={recommendedMonthlyAmount} />
                            <Spacing size={8} />
                            <Border height={16} />
                            <Spacing size={8} />
                            <ListHeader
                              title={
                                <ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>
                              }
                            />
                            <Spacing size={12} />

                            {recommendedSavingsProducts.map(product => (
                              <SavingsProductListItem
                                key={product.id}
                                name={product.name}
                                annualRate={product.annualRate}
                                monthlyAmountRange={{
                                  min: product.minMonthlyAmount,
                                  max: product.maxMonthlyAmount,
                                }}
                                availableTerms={product.availableTerms}
                                isSelected={selectedProduct?.id === product.id}
                                onSelect={() => setSelectedProduct(product)}
                              />
                            ))}

                            <Spacing size={40} />
                          </>
                        </>
                      );
                    }}
                  </SuspenseQuery>
                );
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

const isSelected = (current: 'products' | 'results', target: 'products' | 'results'): boolean => {
  return current === target;
};
