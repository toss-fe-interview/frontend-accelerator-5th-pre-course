import CalculationResultTab from 'components/CalculationResultTab';
import ProductListTab from 'components/ProductListTab';
import UserSavingGoalSection from 'components/UserSavingGoalSection';
import { useState } from 'react';
import {
  Border,

  NavigationBar,
  Spacing,
  Tab
} from 'tosslib';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState<'productList' | 'calculationResult'>('productList');
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <UserSavingGoalSection />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'productList' | 'calculationResult')}>
        <Tab.Item value="productList" selected={selectedTab === 'productList'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="calculationResult" selected={selectedTab === 'calculationResult'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'productList' ? <ProductListTab /> : <CalculationResultTab />}


      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}
