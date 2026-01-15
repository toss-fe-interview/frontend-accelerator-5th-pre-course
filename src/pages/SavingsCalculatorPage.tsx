import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { useState } from 'react';
import { SavingsProduct } from 'api/product';
import { ProductsTab } from 'components/ProductsTab';
import { ResultsTab } from 'components/ResultsTab';

const useTab = () => {
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');
  return [selectedTab, setSelectedTab] as const;
};

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [savingPeriod, setSavingPeriod] = useState(12);

  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectedTab, setSelectedTab] = useTab();

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount.toString()}
        onChange={e => {
          if (isNaN(Number(e.target.value))) {
            return;
          }
          setTargetAmount(Number(e.target.value));
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment.toString()}
        onChange={e => {
          if (isNaN(Number(e.target.value))) {
            return;
          }
          setMonthlyPayment(Number(e.target.value));
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingPeriod}
        onChange={value => {
          setSavingPeriod(value);
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          if (value === 'products' || value === 'results') {
            setSelectedTab(value);
          }
        }}
      >
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <ProductsTab
          monthlyPayment={monthlyPayment}
          savingPeriod={savingPeriod}
          selectedSavingsProduct={selectedSavingsProduct}
          onSelectProduct={setSelectedSavingsProduct}
        />
      )}

      {selectedTab === 'results' && (
        <ResultsTab
          targetAmount={targetAmount}
          monthlyPayment={monthlyPayment}
          savingPeriod={savingPeriod}
          selectedSavingsProduct={selectedSavingsProduct}
          onSelectProduct={setSelectedSavingsProduct}
        />
      )}
    </>
  );
}
