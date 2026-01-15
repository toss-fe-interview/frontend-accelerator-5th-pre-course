import { AmountInput } from 'components/AmountInput';
import { CalculationResult } from 'components/CalculationResult';
import { ProductList } from 'components/ProductList';
import { SavingTermsSelect } from 'components/SavingTermsSelect';
import { filterByMonthlyAmount, filterBySavingsTerm, orderByAnnualRate } from 'domains/product/filters';
import { useSavingsQueryParams } from 'hooks/useSavingsQueryParams';
import { Suspense, useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
type Tab = 'products' | 'results';
export const useTab = (defaultTab: Tab): [Tab, (tab: Tab) => void] => {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return [tab, (tab: Tab) => setTab(tab)];
};

export function SavingsCalculatorPage() {
  const [tab, setTab] = useTab('products');

  const [{ targetAmount, monthlyPayment, selectedTerm }, setSavingsQueryParams] = useSavingsQueryParams();

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount ?? 0}
        onChange={amount => setSavingsQueryParams({ targetAmount: amount })}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment ?? 0}
        onChange={amount => setSavingsQueryParams({ monthlyPayment: amount })}
      />
      <Spacing size={16} />
      <SavingTermsSelect value={selectedTerm ?? 0} onChange={value => setSavingsQueryParams({ selectedTerm: value })} />
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <Tab onChange={value => setTab(value as Tab)}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tab === 'products' && (
        <Suspense fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중...." />} />}>
          <ProductList
            filters={[
              product => filterByMonthlyAmount(product, monthlyPayment),
              product => filterBySavingsTerm(product, selectedTerm),
            ]}
          />
        </Suspense>
      )}

      {tab === 'results' && (
        <Suspense fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중..." />} />}>
          <Spacing size={8} />
          <CalculationResult />
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          <ProductList
            filters={[
              product => filterByMonthlyAmount(product, monthlyPayment),
              product => filterBySavingsTerm(product, selectedTerm),
            ]}
            sortBy={orderByAnnualRate}
            limit={2}
          />
          <Spacing size={40} />
        </Suspense>
      )}
    </>
  );
}
