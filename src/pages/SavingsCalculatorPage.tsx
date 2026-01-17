import { useSuspenseQuery } from '@tanstack/react-query';
import ResultRow from 'features/savings/components/ResultRow';
import SavingsProductItem from 'features/savings/components/SavingsProduct';

import { TABS } from 'features/savings/constants';
import { savingsQueries } from 'features/savings/queries';
import { useTab } from 'hooks/useTab';

import { SavingsProduct } from 'model/types';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { isSame } from 'utils/boolean';
import { numericFormatter } from 'utils/number';

export function SavingsCalculatorPage() {
  const [goalAmount, setGoalAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [period, setPeriod] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const { data: savingsProducts } = useSuspenseQuery(savingsQueries.list());
  const { currentTab, changeTab } = useTab({ key: 'tab', defaultTab: TABS.PRODUCTS });

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>, setState: Dispatch<SetStateAction<string>>) => {
    const value = e.target.value;
    const numericValue = numericFormatter(value);
    if (isNaN(numericValue)) {
      return;
    }
    setState(numericValue.toLocaleString());
  };

  const filteredProducts = savingsProducts.filter(product => {
    const numericGoalAmount = numericFormatter(monthlyAmount);

    const monthlyAmountCondition =
      numericGoalAmount > product.minMonthlyAmount && numericGoalAmount < product.maxMonthlyAmount;
    const isSamePeriodAndTerms = period === product.availableTerms;

    return monthlyAmountCondition && isSamePeriodAndTerms;
  });

  const expectedProfit = selectedProduct
    ? Math.round(numericFormatter(monthlyAmount) * period * (1 + (selectedProduct?.annualRate / 100) * 0.5))
    : 0;
  const diffBetweenGoalAndExpected = numericFormatter(goalAmount) - expectedProfit;

  const recommendAmountForMonth = selectedProduct
    ? Math.round(numericFormatter(goalAmount) / (period * (1 + (selectedProduct?.annualRate / 100) * 0.5)) / 1000) *
      1000
    : 0;

  const recommendedProducts = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
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
          handleAmountChange(e, setGoalAmount);
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        onChange={e => {
          handleAmountChange(e, setMonthlyAmount);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={period}
        onChange={value => {
          setPeriod(value);
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
        filteredProducts.map(product => {
          return (
            <SavingsProductItem
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              isSelected={isSame(product, selectedProduct)}
            />
          );
        })}

      {currentTab === TABS.RESULTS && (
        <>
          {selectedProduct ? (
            <>
              <Spacing size={8} />
              <ListRow contents={<ResultRow subject="목표 금액" amount={expectedProfit} />} />
              <ListRow contents={<ResultRow subject="목표 금액과의 차이" amount={diffBetweenGoalAndExpected} />} />
              <ListRow contents={<ResultRow subject="추천 월 납입 금액" amount={recommendAmountForMonth} />} />
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {recommendedProducts.map(product => {
            return (
              <SavingsProductItem key={product.id} product={product} isSelected={isSame(product, selectedProduct)} />
            );
          })}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
