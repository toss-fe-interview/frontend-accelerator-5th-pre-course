import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';

import {
  calculateExpectedProfit,
  calculateDifferenceProfit,
  calculateRecommendedMonthlyAmount,
  isWithinAmountRange,
  hasMatchingTerm,
  sortByAnnualRate,
} from 'utils/calculateSavings';
import { SavingsProduct } from 'types/savings';
import { getSavingsProductsQueryOptions } from 'api/savings-products';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';

import { AmountField } from 'components/AmountField';
import { TermSelect } from 'components/TermSelect';
import { LabelValueRow } from 'components/LabelValueRow';
import { formatAmount } from 'utils/format';

type TabValue = 'products' | 'results';

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

      <Tab onChange={value => setCurrentTab(value as TabValue)}>
        <Tab.Item value="products" selected={currentTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={currentTab === 'results'}>
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
                    select={(products: SavingsProduct[]) =>
                      products.filter(
                        product => isWithinAmountRange(product, monthlyAmount) && hasMatchingTerm(product, savingsTerm)
                      )
                    }
                  >
                    {({ data: filteredSavingsProducts }: { data: SavingsProduct[] }) =>
                      filteredSavingsProducts.map(product => {
                        const isSelected = selectedProduct?.id === product.id;
                        return (
                          <ListRow
                            key={product.id}
                            contents={
                              <ListRow.Texts
                                type="3RowTypeA"
                                top={product.name}
                                middle={`연 이자율: ${product.annualRate}%`}
                                bottom={`${formatAmount(product.minMonthlyAmount)}원 ~ ${formatAmount(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                                bottomProps={{ fontSize: 13, color: colors.grey600 }}
                              />
                            }
                            right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
                            onClick={() => setSelectedProduct(product)}
                          />
                        );
                      })
                    }
                  </SuspenseQuery>
                );
              case 'results':
                return (
                  <SuspenseQuery
                    {...getSavingsProductsQueryOptions()}
                    select={(products: SavingsProduct[]) =>
                      [...products]
                        .filter(
                          product =>
                            isWithinAmountRange(product, monthlyAmount) && hasMatchingTerm(product, savingsTerm)
                        )
                        .sort(sortByAnnualRate.desc)
                        .slice(0, 2)
                    }
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

                            {recommendedSavingsProducts.map(product => {
                              const isSelected = selectedProduct?.id === product.id;
                              return (
                                <ListRow
                                  key={product.id}
                                  contents={
                                    <ListRow.Texts
                                      type="3RowTypeA"
                                      top={product.name}
                                      middle={`연 이자율: ${product.annualRate}%`}
                                      bottom={`${formatAmount(product.minMonthlyAmount)}원 ~ ${formatAmount(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                                      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                                    />
                                  }
                                  right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
                                  onClick={() => setSelectedProduct(product)}
                                />
                              );
                            })}

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
