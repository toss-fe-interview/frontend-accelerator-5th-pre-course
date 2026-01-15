import { ErrorBoundary, Suspense } from '@suspensive/react';
import { usePrefetchQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { formatNumber } from 'utils/format';
import { savingsProductsQueries } from './api/queries';
import CalculationResultTab from './components/CalculationResultTab';
import ProductListTab from './components/ProductListTab';
import { type CalculatorParams, useCalculatorParams } from './hooks/useCalculatorParams';

const TABS_CONFIG = {
  products: '적금 상품',
  results: '계산 결과',
} as const;

type TabKey = keyof typeof TABS_CONFIG;
const isValidTabKey = (tab: string): tab is TabKey => tab in TABS_CONFIG;

type NumberInputKey = keyof Pick<CalculatorParams, 'targetAmount' | 'monthlyAmount'>;

export default function SavingsCalculatorPage() {
  usePrefetchQuery(savingsProductsQueries.listQuery());

  const [currentTab, setCurrentTab] = useState<TabKey>('products');
  const { targetAmount, monthlyAmount, savingTerms, setCalculatorParams } = useCalculatorParams();

  const handleTabChange = (tab: string) => {
    if (isValidTabKey(tab)) {
      setCurrentTab(tab);
    }
  };

  const handleNumberInputChange = (key: NumberInputKey, value: string) => {
    const next = parseNumber(value);
    setCalculatorParams({ [key]: next ?? null });
  };

  const handleSavingTermsChange = (value: number) => {
    setCalculatorParams({ savingTerms: value });
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount ? formatNumber(targetAmount) : ''}
        onChange={e => handleNumberInputChange('targetAmount', e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount ? formatNumber(monthlyAmount) : ''}
        onChange={e => handleNumberInputChange('monthlyAmount', e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingTerms ?? undefined}
        onChange={handleSavingTermsChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={18}>18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        {Object.entries(TABS_CONFIG).map(([tab, label]) => (
          <Tab.Item key={tab} value={tab} selected={currentTab === tab}>
            {label}
          </Tab.Item>
        ))}
      </Tab>

      {currentTab === 'products' && (
        <ErrorBoundary fallback={<div>상품 목록을 불러오는 중 에러가 발생했습니다.</div>}>
          <Suspense fallback={<div>상품 목록을 불러오는 중입니다...</div>}>
            <ProductListTab />
          </Suspense>
        </ErrorBoundary>
      )}
      {currentTab === 'results' && (
        <ErrorBoundary fallback={<div>계산 결과를 불러오는 중 에러가 발생했습니다.</div>}>
          <Suspense fallback={<div>계산 결과를 불러오는 중입니다...</div>}>
            <CalculationResultTab />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

const isPositiveInteger = (value: number): boolean => Number.isInteger(value) && value > 0;

function parseNumber(value: string) {
  if (value === '') return;

  const numericValue = Number(value.replace(/\D/g, ''));
  if (isPositiveInteger(numericValue)) {
    return numericValue;
  }
}
