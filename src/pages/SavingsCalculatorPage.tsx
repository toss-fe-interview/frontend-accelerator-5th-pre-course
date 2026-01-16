import {
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { useState } from 'react';

import { formatCurrency, parseNumberInput } from 'utils/format';
import { calculateSavings } from 'utils/calculateSavings';
import { SavingsProduct } from 'types/savings';
import { getSavingsProductsQueryOptions } from 'api/savings-products';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';

import { RecommendedProductList } from 'components/RecommendedProductList';
import { SavingsProductList } from 'components/SavingsProductList';

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
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount !== null ? formatCurrency(targetAmount) : ''}
        onChange={e => setTargetAmount(parseNumberInput(e.target.value))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount !== null ? formatCurrency(monthlyAmount) : ''}
        onChange={e => setMonthlyAmount(parseNumberInput(e.target.value))}
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
                    {({ data: savingsProducts }) => (
                      <SavingsProductList
                        savingsProductList={filterSavingsProducts({
                          data: savingsProducts,
                          filterOptions: { monthlyAmount, savingsTerm },
                        })}
                        selectedProduct={selectedProduct}
                        onSelectProduct={setSelectedProduct}
                      />
                    )}
                  </SuspenseQuery>
                );
              case 'results':
                return (
                  <SuspenseQuery {...getSavingsProductsQueryOptions()}>
                    {({ data: savingsProducts }) => {
                      if (!selectedProduct) {
                        return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
                      }

                      const { expectedProfit, differenceProfit, recommendedMonthlyAmount } = calculateSavings({
                        monthlyAmount: monthlyAmount ?? 0,
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
                                  bottom={`${formatCurrency(expectedProfit)}원`}
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
                                  bottom={`${formatCurrency(differenceProfit)}원`}
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
                                  bottom={`${formatCurrency(Math.round(recommendedMonthlyAmount))}원`}
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
                            <RecommendedProductList
                              savingsProductList={filterSavingsProducts({
                                data: savingsProducts,
                                filterOptions: { monthlyAmount, savingsTerm },
                              })}
                              selectedProduct={selectedProduct}
                              onSelectProduct={setSelectedProduct}
                            />
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
