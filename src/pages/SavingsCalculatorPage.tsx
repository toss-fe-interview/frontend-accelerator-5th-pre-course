import { type SavingsProduct, useFetchSavingProducts } from 'api/savings-products';
import { CalculationResult } from 'components/CalculationResult';
import { MoneyInputField } from 'components/controls/MoneyInputField';
import { TermSelectBottomSheet } from 'components/controls/TermSelectBottomSheet';
import { MessageText } from 'components/MessageText';
import { SavingsProductItem } from 'components/SavingsProductItem';
import { useTab } from 'hooks/useTab';
import { useMemo, useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { filterSavingsProducts } from 'utils/savings-filter';

export function SavingsCalculatorPage() {
  // 인풋 칸
  const [targetAmount, setTargetAmount] = useState<number | undefined>(undefined);
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined>(undefined);
  const [term, setTerm] = useState<number>(12);
  // 선택한 적금 상품
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  // 탭
  const { currentTab, handleTabChange, TAB } = useTab();

  const { savingsProducts, isLoading, isError } = useFetchSavingProducts();
  // 적금계산기를 통한 필터링
  const filteredSavingsProducts = useMemo(() => {
    return filterSavingsProducts(savingsProducts, term, monthlyAmount);
  }, [savingsProducts, term, monthlyAmount]);

  /**
   * 데이터 전송 상태 뷰
   */
  if (isLoading) {
    return (
      <>
        <NavigationBar title="적금 계산기" />
        <Spacing size={16} />
        <MessageText message="적금 상품을 불러오는 중입니다." />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <NavigationBar title="적금 계산기" />
        <Spacing size={16} />
        <MessageText message="적금 상품을 불러오는데 실패했습니다." />
      </>
    );
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
      <Tab onChange={handleTabChange}>
        <Tab.Item value={TAB.PRODUCTS} selected={currentTab === TAB.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB.RESULTS} selected={currentTab === TAB.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 */}
      {currentTab === TAB.PRODUCTS && (
        <>
          {filteredSavingsProducts.length > 0 ? (
            filteredSavingsProducts.map(product => {
              const isSavingsProductSelected = selectedSavingsProduct?.id === product.id;
              const handleSavingsProductClick = () => {
                if (isSavingsProductSelected) {
                  setSelectedSavingsProduct(null);
                } else {
                  setSelectedSavingsProduct(product);
                }
              };

              return (
                <SavingsProductItem
                  key={product.id}
                  product={product}
                  onClick={handleSavingsProductClick}
                  isSelected={isSavingsProductSelected}
                />
              );
            })
          ) : (
            <MessageText message="적금 상품이 없습니다." />
          )}
        </>
      )}

      {/* 계산 결과 */}
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

          {/* 추천 상품 목록 */}
          {filteredSavingsProducts.length > 0 ? (
            <>
              {filteredSavingsProducts
                .sort(function sortByAnnualRateDesc(a, b) {
                  return b.annualRate - a.annualRate;
                })
                .slice(0, 2)
                .map(product => (
                  <SavingsProductItem key={product.id} product={product} isSelected={false} />
                ))}
            </>
          ) : (
            <MessageText message="추천 상품이 없습니다." />
          )}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
