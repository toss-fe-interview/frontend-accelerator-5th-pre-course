import { type SavingsProduct, useSavingsProducts } from 'api/savings-products';
import { CalculationResult } from 'components/CalculationResult';
import { View } from 'components/CommonView';
import { MoneyInputField } from 'components/controls/MoneyInputField';
import { TermSelectBottomSheet } from 'components/controls/TermSelectBottomSheet';
import { SavingsProductList } from 'components/SavingsProductList';
import { SavingsRecommendation } from 'components/SavingsRecommendation';
import { useMemo, useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { filterSavingsProducts } from 'utils/savings-filter';

const TAB = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabType = (typeof TAB)[keyof typeof TAB];

export function SavingsCalculatorPage() {
  const { savingsProducts, isLoading, isError } = useSavingsProducts();
  // 인풋 칸
  const [targetAmount, setTargetAmount] = useState<number | undefined>(undefined);
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined>(undefined);
  const [term, setTerm] = useState<number>(12);
  // 선택한 적금 상품
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | undefined>(undefined);
  // 탭
  const [currentTab, setCurrentTab] = useState<TabType>(TAB.PRODUCTS);

  // 적금계산기를 통한 필터링
  const filteredSavingsProducts = useMemo(() => {
    return filterSavingsProducts(savingsProducts, term, monthlyAmount);
  }, [savingsProducts, monthlyAmount, term]);

  /**
   * 데이터 전송 상태 뷰
   */
  if (isLoading) {
    return <View.Loading />;
  }

  if (isError) {
    return <View.Error />;
  }

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      {/* 인풋 칸 */}
      <MoneyInputField label="목표 금액" value={targetAmount} onValueChange={setTargetAmount} />
      <Spacing size={16} />
      <MoneyInputField label="월 납입액" value={monthlyAmount} onValueChange={setMonthlyAmount} />
      <Spacing size={16} />
      <TermSelectBottomSheet label="저축 기간" value={term} onValueChange={setTerm} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* 탭 */}
      <Tab
        onChange={value => {
          setCurrentTab(value as TabType);
        }}
      >
        <Tab.Item value={TAB.PRODUCTS} selected={currentTab === TAB.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB.RESULTS} selected={currentTab === TAB.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 리스트 */}
      {currentTab === TAB.PRODUCTS && (
        <SavingsProductList
          savingsProducts={filteredSavingsProducts}
          selectedSavingsProductId={selectedSavingsProduct?.id}
          onSelectedSavingsProductChange={setSelectedSavingsProduct}
        />
      )}

      {currentTab === TAB.RESULTS && (
        <>
          <Spacing size={8} />

          <CalculationResult
            targetAmount={targetAmount}
            monthlyAmount={monthlyAmount}
            term={term}
            selectedSavingsProduct={selectedSavingsProduct}
          />

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <SavingsRecommendation savingsProducts={filteredSavingsProducts} />

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
