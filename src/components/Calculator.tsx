import { useState } from 'react';
import { ProductItem } from './ProductContainer';
import { Border, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import CalculationResult from './CalculationResult';
import ProductList from './ProductList';

type Tabs = 'products' | 'results';
export type FormDataType = {
  targetAmount: string;
  monthlPayment: string;
  // 6, 12, 24
  savingPeriod: number;
};

interface CalculatorProps {
  products: ProductItem[];
  selectProduct: (id: string) => void;
}

export default function Calculator({ products, selectProduct }: CalculatorProps) {
  const [tab, setTab] = useState<Tabs>('products');
  const [formData, setFormData] = useState<FormDataType>({
    targetAmount: '',
    monthlPayment: '',
    savingPeriod: 12,
  });

  function onChangeTab(tab: Tabs) {
    setTab(tab);
  }

  // 필드에 맞는 값을 업데이트
  function handleChangeField<K extends keyof FormDataType>(key: K, value: FormDataType[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  // 필터로직 개선
  function filterProdcuts(products: ProductItem[]) {
    return products
      .filter(product => product.minMonthlyAmount > Number(formData.monthlPayment))
      .filter(item => item.maxMonthlyAmount < Number(formData.monthlPayment))
      .filter(item => item.availableTerms === formData.savingPeriod);
  }

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={Number(formData.targetAmount).toLocaleString()}
        onChange={e => {
          const numericValue = e.target.value.replace(/[^0-9]/g, '');
          handleChangeField('targetAmount', numericValue);
        }}
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={Number(formData.monthlPayment).toLocaleString()}
        onChange={e => {
          const numericValue = e.target.value.replace(/[^0-9]/g, '');
          handleChangeField('monthlPayment', numericValue);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formData.savingPeriod}
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
        <ProductList products={filterProdcuts(products)} handleClickProduct={selectProduct} />
      ) : (
        <CalculationResult products={products} data={formData} handleClickProduct={selectProduct} />
      )}
    </>
  );
}
