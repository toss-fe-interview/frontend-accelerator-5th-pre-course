import { useSuspenseQuery } from '@tanstack/react-query';
import ResultRow from 'features/savings/components/ResultRow';
import SavingsProductItem from 'features/savings/components/SavingsProduct';

import { TABS } from 'features/savings/constants';
import { savingsQueries } from 'features/savings/queries';
import {
  calcDiffAmount,
  calcExpectProfit,
  calcRecommendAmountForMonth,
  getMatchingSavingsProducts,
  getRecommendedProduct,
  handleAmountChange,
} from 'features/savings/utils/savings';
import { useSetQueryParams } from 'hooks/useSetQueryParams';
import { useTab } from 'hooks/useTab';

import { useState } from 'react';
import { SavingsProduct } from 'model/types';

import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { numericFormatter } from 'utils/number';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const { data: savingsProducts } = useSuspenseQuery(savingsQueries.list());
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
          handleAmountChange(e, value => setQueryParams('goalAmount', value));
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={e => {
          handleAmountChange(e, value => setQueryParams('monthlyAmount', value));
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={period}
        onChange={value => {
          setQueryParams('period', value.toString());
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

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
      {currentTab === TABS.PRODUCTS &&
        (getMatchingSavingsProducts({ savingsProducts, monthlyAmount, period }).length === 0
          ? savingsProducts
          : getMatchingSavingsProducts({ savingsProducts, monthlyAmount, period })
        ).map(savingProduct => {
          return (
            <SavingsProductItem
              key={savingProduct.id}
              product={savingProduct}
              isSelected={savingProduct.id === selectedProduct?.id}
              onSelect={setSelectedProduct}
            />
          );
        })}

      {currentTab === TABS.RESULTS && (
        <>
          {selectedProduct ? (
            <>
              <Spacing size={8} />
              <ListRow
                contents={
                  <ResultRow
                    subject="목표 금액"
                    amount={calcExpectProfit({ selectedProduct, monthlyAmount, period })}
                  />
                }
              />
              <ListRow
                contents={
                  <ResultRow
                    subject="목표 금액과의 차이"
                    amount={calcDiffAmount({
                      goalAmount: numericFormatter(goalAmount),
                      expectedProfit: calcExpectProfit({ selectedProduct, monthlyAmount, period }),
                    })}
                  />
                }
              />
              <ListRow
                contents={
                  <ResultRow
                    subject="추천 월 납입 금액"
                    amount={calcRecommendAmountForMonth({ selectedProduct, goalAmount, period })}
                  />
                }
              />
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {getRecommendedProduct({
            product: [...getMatchingSavingsProducts({ savingsProducts, monthlyAmount, period })],
            options: { offset: 0, limit: 2 },
          }).map(recommendedProduct => {
            return (
              <SavingsProductItem
                key={recommendedProduct.id}
                product={recommendedProduct}
                isSelected={recommendedProduct.id === selectedProduct?.id}
              />
            );
          })}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
