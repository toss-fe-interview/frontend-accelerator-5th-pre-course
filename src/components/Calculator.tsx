import { useState } from 'react';
import { ProductItem } from './ProductContainer';
import { Assets, Border, colors, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

type Tabs = 'products' | 'results';

interface CalculatorProps {
  products: ProductItem[];
  selectProduct: (id: string) => void;
}

export default function Calculator({ products, selectProduct }: CalculatorProps) {
  // 폼을 다뤄야함. (사용자 입력)
  // 탭을 뭐 눌렀는지 관리.

  const [tab, setTab] = useState<Tabs>('products');

  function onChangeTab(tab: Tabs) {
    setTab(tab);
  }

  // 폼 데이터와 products를 자식한테 내려줘야함.

  // 적금상품 컴포넌트에는 filter된 products만 내려줌 + select도 내려줘야함.
  // 계산결과 컴포넌트에는 products랑 입력값을 내려줘서 계산하게 해야함.

  return (
    <>
      <TextField label="목표 금액" placeholder="목표 금액을 입력하세요" suffix="원" />
      <Spacing size={16} />
      <TextField label="월 납입액" placeholder="희망 월 납입액을 입력하세요" suffix="원" />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={12} onChange={() => {}}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={e => {
          onChangeTab(e as Tabs);
        }}
      >
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
    </>
  );
}
