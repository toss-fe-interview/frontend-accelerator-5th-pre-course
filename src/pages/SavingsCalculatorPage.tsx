import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { useState } from 'react';

import { formatAmount } from 'utils/format';
import {
  calculateExpectedProfit,
  calculateDifferenceProfit,
  calculateRecommendedMonthlyAmount,
} from 'utils/calculateSavings';
import { SavingsProduct } from 'types/savings';
import { getSavingsProductsQueryOptions } from 'api/savings-products';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';

import { orderBy, take } from 'es-toolkit';
import { AmountField } from 'components/AmountField';

export function SavingsCalculatorPage() {
  // 목표금액
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  // 월 납입액
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);
  // 저축 기간
  const [savingsTerm, setSavingsTerm] = useState<number | null>(null);

  // 현재 탭
  const [currentTab, setCurrentTab] = useState<'products' | 'results'>('products');

  // 선택된 상품
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      {/* 무엇을 위한 컴포넌트인가? 
          목표 금액을 다루는 입력창
      */}
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
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsTerm !== null ? String(savingsTerm) : null}
        onChange={value => setSavingsTerm(value === null ? null : Number(value))}
      >
        <SelectBottomSheet.Option value="6">6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value="12">12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value="18">18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value="24">24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setCurrentTab(value as 'products' | 'results')}>
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
                  <SuspenseQuery {...getSavingsProductsQueryOptions()}>
                    {/* react query의 select 옵션도 써보기 */}
                    {({ data: savingsProducts }) =>
                      filterSavingsProducts({
                        data: savingsProducts,
                        filterOptions: { monthlyAmount, savingsTerm },
                      }).map(product => (
                        <ListRow
                          key={product.id}
                          contents={
                            <ListRow.Texts
                              type="3RowTypeA"
                              top={product.name}
                              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                              middle={`연 이자율: ${product.annualRate}%`}
                              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                              bottom={`${formatAmount(product.minMonthlyAmount)}원 ~ ${formatAmount(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                              bottomProps={{ fontSize: 13, color: colors.grey600 }}
                            />
                          }
                          right={
                            selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
                          }
                          onClick={() => setSelectedProduct(product)}
                        />
                      ))
                    }
                  </SuspenseQuery>
                );
              case 'results':
                return (
                  <SuspenseQuery {...getSavingsProductsQueryOptions()}>
                    {({ data: savingsProducts }) => {
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
                            <ListRow
                              contents={
                                <ListRow.Texts
                                  type="2RowTypeA"
                                  top="예상 수익 금액"
                                  topProps={{ color: colors.grey600 }}
                                  bottom={`${formatAmount(expectedProfit)}원`}
                                  bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                                />
                              }
                            />
                            <ListRow
                              contents={
                                <ListRow.Texts
                                  type="2RowTypeA"
                                  top="목표 금액과의 차이"
                                  topProps={{ color: colors.grey600 }}
                                  bottom={`${formatAmount(differenceProfit)}원`}
                                  bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                                />
                              }
                            />
                            <ListRow
                              contents={
                                <ListRow.Texts
                                  type="2RowTypeA"
                                  top="추천 월 납입 금액"
                                  topProps={{ color: colors.grey600 }}
                                  bottom={`${formatAmount(recommendedMonthlyAmount)}원`}
                                  bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                                />
                              }
                            />
                            <Spacing size={8} />
                            <Border height={16} />
                            <Spacing size={8} />

                            <ListHeader
                              title={
                                <ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>
                              }
                            />
                            <Spacing size={12} />

                            {take(
                              orderBy(
                                filterSavingsProducts({
                                  data: savingsProducts,
                                  filterOptions: { monthlyAmount, savingsTerm },
                                }),
                                ['annualRate'],
                                ['desc']
                              ),
                              2
                            ).map(product => (
                              <ListRow
                                key={product.id}
                                contents={
                                  <ListRow.Texts
                                    type="3RowTypeA"
                                    top={product.name}
                                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                                    middle={`연 이자율: ${product.annualRate}%`}
                                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                                    bottom={`${formatAmount(product.minMonthlyAmount)}원 ~ ${formatAmount(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                                  />
                                }
                                right={
                                  selectedProduct?.id === product.id ? (
                                    <Assets.Icon name="icon-check-circle-green" />
                                  ) : null
                                }
                                onClick={() => setSelectedProduct(product)}
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

interface FilterProductsProps {
  data: SavingsProduct[];
  filterOptions: {
    monthlyAmount: number | null;
    savingsTerm: number | null;
  };
}

function filterSavingsProducts({ data, filterOptions }: FilterProductsProps) {
  const { monthlyAmount, savingsTerm } = filterOptions;

  const predicates: Array<(product: SavingsProduct) => boolean> = [];

  if (monthlyAmount !== null) {
    predicates.push(product => {
      const isWithinMonthlyAmountRange =
        monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
      return isWithinMonthlyAmountRange;
    });
  }

  if (savingsTerm !== null) {
    predicates.push(product => savingsTerm === product.availableTerms);
  }

  if (predicates.length === 0) {
    return data;
  }

  return data.filter(product => predicates.every(predicate => predicate(product)));
}
