import { useState } from 'react';
import { Border, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import CalculationResult from './CalculationResult';
import ProductList from './ProductList';
import { ProductItem } from 'types/products';
import { CalculatorForm } from 'types/calculate';

type Tabs = 'products' | 'results';

interface SavingCalculatorProps {
  products: ProductItem[];
  onProductSelect: (id: string) => void;
}

export default function SavingCalculator({ products, onProductSelect }: SavingCalculatorProps) {
  const [tab, setTab] = useState<Tabs>('products');
  const [calculatingData, setCalculatingData] = useState<CalculatorForm>({
    targetAmount: '',
    monthlyPayment: '',
    savingPeriod: 12,
  });

  function onChangeTab(tab: Tabs) {
    setTab(tab);
  }

  // 필드에 맞는 값을 업데이트
  function handleChangeField<K extends keyof CalculatorForm>(key: K, value: CalculatorForm[K]) {
    setCalculatingData(prev => ({ ...prev, [key]: value }));
  }

  // 필터로직 개선
  function filteredProductsByInputs(products: ProductItem[]) {
    return products
      .filter(product => product.minMonthlyAmount > Number(calculatingData.monthlyPayment))
      .filter(item => item.maxMonthlyAmount < Number(calculatingData.monthlyPayment))
      .filter(item => item.availableTerms === calculatingData.savingPeriod);
  }

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={Number(calculatingData.targetAmount).toLocaleString()}
        onChange={event => {
          const numericValue = event.target.value.replace(/[^0-9]/g, '');
          handleChangeField('targetAmount', numericValue);
        }}
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={Number(calculatingData.monthlyPayment).toLocaleString()}
        onChange={event => {
          const numericValue = event.target.value.replace(/[^0-9]/g, '');
          handleChangeField('monthlyPayment', numericValue);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={calculatingData.savingPeriod}
        onChange={period => {
          handleChangeField('savingPeriod', period);
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
        onChange={tab => {
          onChangeTab(tab as Tabs);
        }}
      >
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tab === 'products' ? (
        // 입력된 값이 없으면 일반 products를 노출 | 필터된 프로덕트 노출
        <ProductList products={filteredProductsByInputs(products)} onClickProduct={onProductSelect} />
      ) : (
        <CalculationResult products={products} userInput={calculatingData} onClickProduct={onProductSelect} />
      )}
    </>
  );
}
